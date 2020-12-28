const css = require('css')

const EOF = Symbol("EOF");
const REG_ASCII_ALPHA = /^[a-zA-Z]$/;
const REG_BLANK = /^[\t\n\f ]$/;
const NULL = "\u0000";

let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;

const rules = []
function addCSSRules(text) {
  const ast = css.parse(text)
  rules.push(...ast.stylesheet.rules)
}

function match(element, selector) {
  console.log(selector)
  if (element.type === 'text') return false

  if (selector.charAt(0) === '#') {
    return element.attributes.some(attribute => attribute.name === 'id' && attribute.value === selector.slice(1))
  } else if (selector.charAt(0) === '.') {
    return element.attributes.some(attribute => attribute.name === 'class' && attribute.value === selector.slice(1))
  } else {
    if (element.tagName === selector) {
      return true
    }
  }

  return false
}

function computeCSS(element) {
  const elements = stack.slice().reverse()
  
  if (!element.computedStyle) element.computedStyle = {}

  for (let rule of rules) {
    const selectorParts = rule.selectors[0].split(' ').reverse()

    if (!match(element, selectorParts[0])) continue

    let j = 1
    for (let i = 0; i < elements.length & j < selectorParts.length; i++) {
      if (match(elements[i], selectorParts[j])) j++
    }

    const matched = j >= selectorParts.length

    if (matched) {
      console.log('Element', element, 'matched rule', rule)
    }
  }
}

const stack = [{ type: "document", children: [] }];

function emit(token) {
  let top = stack[stack.length - 1];
  if (token.type === "startTag") {
    const element = {
      type: "element",
      children: [],
      attributes: [],
    };

    element.tagName = token.tagName;
    element.attributes = token.attributes;

    computeCSS(element)

    top.children.push(element);
    element.parent = top;

    if (!token.isSelfClosing) {
      stack.push(element);
    }

    currentTextNode = null
  } else if (token.type === 'endTag') {
    if (top.tagName !== token.tagName) {
      throw new Error('Tag start end does\'t match!')
    } else {

      if (token.tagName === 'style') {
        addCSSRules(top.children[0].content)
      }

      stack.pop()
    }

    currentTextNode = null
  } else if (token.type === 'text') {
    if (currentTextNode === null) {
      currentTextNode = {
        type: 'textNode',
        content: ''
      }
      top.children.push(currentTextNode)
    } else {
      currentTextNode.content += token.content
    }
  }
}

/**
 * 13.2.5.1 Data state https://html.spec.whatwg.org/multipage/parsing.html#data-state
 */
function data(c) {
  if (c === "&") {
    dontSupport();
    return;
  } else if (c === "<") {
    return tagOpen;
  } else if (c === EOF) {
    emit({
      type: "EOF",
    });
    return;
  } else if (c === NULL) {
    parseError(
      `This is an unexpected-null-character parse error. Emit the current input character as a character token.`
    );
    return;
  } else {
    emit({
      type: "text",
      content: c,
    });
    return data;
  }
}

/**
 * 13.2.5.6 Tag open state https://html.spec.whatwg.org/multipage/parsing.html#tag-open-state
 */
function tagOpen(c) {
  if (c === "!") {
    dontSupport();
    return;
  } else if (c === "/") {
    return endTagOpen;
  } else if (c.match(REG_ASCII_ALPHA)) {
    currentToken = {
      type: "startTag",
      tagName: "",
      attributes: [],
    };
    return tagName(c);
  } else if (c === "?") {
    parseError(
      `This is an unexpected-question-mark-instead-of-tag-name parse error. Create a comment token whose data is the empty string. Reconsume in the bogus comment state.`
    );
    return;
  } else if (c === EOF) {
    emit({
      type: "EOF",
    });
    return;
  } else {
    parseError(
      `This is an invalid-first-character-of-tag-name parse error. Emit a U+003C LESS-THAN SIGN character token. Reconsume in the data state.`
    );
    return;
  }
}

/**
 * 13.2.5.7 End tag open state https://html.spec.whatwg.org/multipage/parsing.html#end-tag-open-state
 */
function endTagOpen(c) {
  if (c.match(REG_ASCII_ALPHA)) {
    currentToken = {
      type: "endTag",
      tagName: "",
    };
    return tagName(c);
  } else if (c === ">") {
    parseError(
      `This is a missing-end-tag-name parse error. Switch to the data state.`
    );
    return;
  } else if (c === EOF) {
    parseError(
      `This is an eof-before-tag-name parse error. Emit a U+003C LESS-THAN SIGN character token, a U+002F SOLIDUS character token and an end-of-file token.`
    );
    return;
  } else {
    parseError(
      `This is an invalid-first-character-of-tag-name parse error. Create a comment token whose data is the empty string. Reconsume in the bogus comment state.`
    );
    return;
  }
}

/**
 * 13.2.5.8 Tag name state https://html.spec.whatwg.org/multipage/parsing.html#tag-name-state
 */
function tagName(c) {
  if (c.match(REG_BLANK)) {
    return beforeAttributeName;
  } else if (c === "/") {
    return selfCloseStartTag;
  } else if (c === ">") {
    emit(currentToken);
    return data;
  } else if (c === NULL) {
    parseError(
      `This is an unexpected-null-character parse error. Append a U+FFFD REPLACEMENT CHARACTER character to the current tag token's tag name.`
    );
    return;
  } else if (c === EOF) {
    parseError(`This is an eof-in-tag parse error. Emit an end-of-file token.`);
    return;
  } else {
    currentToken.tagName += c;
    return tagName;
  }
}

/**
 * 13.2.5.32 Before attribute name state https://html.spec.whatwg.org/multipage/parsing.html#before-attribute-name-state
 */
function beforeAttributeName(c) {
  if (c.match(REG_BLANK)) {
    return beforeAttributeName;
  } else if (c === "/" || c === ">" || c === EOF) {
    return afterAttributeName(c);
  } else if (c === "=") {
    parseError(
      `This is an unexpected-equals-sign-before-attribute-name parse error. Start a new attribute in the current tag token. Set that attribute's name to the current input character, and its value to the empty string. Switch to the attribute name state.`
    );
    return;
  } else {
    currentAttribute = {
      name: "",
      value: "",
    };
    return attributeName(c);
  }
}

/**
 * 13.2.5.33 Attribute name state https://html.spec.whatwg.org/multipage/parsing.html#attribute-name-state
 */
function attributeName(c) {
  if (c.match(REG_BLANK) || c === "/" || c === ">" || c === EOF) {
    return afterAttributeName(c);
  } else if (c === "=") {
    return beforeAttributeValue;
  } else if (c.match(REG_ASCII_ALPHA)) {
    currentAttribute.name += c.toLowerCase();
    return attributeName;
  } else if (c === NULL) {
    parseError(
      `This is an unexpected-null-character parse error. Append a U+FFFD REPLACEMENT CHARACTER character to the current attribute's name.`
    );
    return;
  } else if (c === '"' || c === "'" || c === "<") {
    parseError(
      `This is an unexpected-character-in-attribute-name parse error. Treat it as per the "anything else" entry below.`
    );
    return;
  } else {
    currentAttribute.name += c;
    return attributeName;
  }
}

/**
 * 13.2.5.34 After attribute name state https://html.spec.whatwg.org/multipage/parsing.html#after-attribute-name-state
 */
function afterAttributeName(c) {
  if (c.match(REG_BLANK)) {
    return afterAttributeName;
  } else if (c === "/") {
    return selfCloseStartTag;
  } else if (c === "=") {
    return beforeAttributeValue;
  } else if (c === ">") {
    currentToken.attributes.push(currentAttribute);
    emit(currentToken);
    return data;
  } else if (c === EOF) {
    parseError(`This is an eof-in-tag parse error. Emit an end-of-file token.`);
    return;
  } else {
    currentToken.attributes.push(currentAttribute);
    currentAttribute = {
      name: "",
      value: "",
    };
    return attributeName(c);
  }
}

/**
 * 13.2.5.35 Before attribute value state https://html.spec.whatwg.org/multipage/parsing.html#before-attribute-value-state
 */
function beforeAttributeValue(c) {
  if (c.match(REG_BLANK)) {
    return beforeAttributeValue;
  } else if (c === '"') {
    return doubleQuotedAttributeValue;
  } else if (c === "'") {
    return singleQuotedAttributeValue;
  } else if (c === ">") {
    parseError(
      `This is a missing-attribute-value parse error. Switch to the data state. Emit the current tag token.`
    );
    return;
  } else {
    return unQuotedAttributeValue(c);
  }
}

/**
 * 13.2.5.36 Attribute value (double-quoted) state https://html.spec.whatwg.org/multipage/parsing.html#attribute-value-(double-quoted)-state
 */
function doubleQuotedAttributeValue(c) {
  if (c === '"') {
    currentToken.attributes.push(currentAttribute);
    return afterQuotedAttributeValue;
  } else if (c === "&") {
    dontSupport();
    return;
  } else if (c === NULL) {
    parseError(
      `This is an unexpected-null-character parse error. Append a U+FFFD REPLACEMENT CHARACTER character to the current attribute's value.`
    );
    return;
  } else if (c === EOF) {
    parseError(`This is an eof-in-tag parse error. Emit an end-of-file token.`);
    return;
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

/**
 * 13.2.5.37 Attribute value (single-quoted) state https://html.spec.whatwg.org/multipage/parsing.html#attribute-value-(single-quoted)-state
 */
function singleQuotedAttributeValue(c) {
  if (c === "'") {
    currentToken.attributes.push(currentAttribute);
    return afterQuotedAttributeValue;
  } else if (c === "&") {
    dontSupport();
    return;
  } else if (c === NULL) {
    parseError(
      `This is an unexpected-null-character parse error. Append a U+FFFD REPLACEMENT CHARACTER character to the current attribute's value.`
    );
    return;
  } else if (c === EOF) {
    parseError(`This is an eof-in-tag parse error. Emit an end-of-file token.`);
    return;
  } else {
    currentAttribute.value += c;
    return singleQuotedAttributeValue;
  }
}

/**
 * 13.2.5.38 Attribute value (unquoted) state https://html.spec.whatwg.org/multipage/parsing.html#attribute-value-(unquoted)-state
 */
function unQuotedAttributeValue(c) {
  if (c.match(REG_BLANK)) {
    currentToken.attributes.push(currentAttribute);
    return beforeAttributeName;
  } else if (c === "&") {
    dontSupport();
    return;
  } else if (c === ">") {
    currentToken.attributes.push(currentAttribute);
    emit(currentToken);
    return data;
  } else if (c === NULL) {
    parseError(
      `This is an unexpected-null-character parse error. Append a U+FFFD REPLACEMENT CHARACTER character to the current attribute's value.`
    );
    return;
  } else if (c === '"' || c === "'" || c === "<" || c === "=" || c === "`") {
    parseError(
      `This is an unexpected-character-in-unquoted-attribute-value parse error. Treat it as per the "anything else" entry below.`
    );
    return;
  } else if (c === EOF) {
    parseError(`This is an eof-in-tag parse error. Emit an end-of-file token.`);
    return;
  } else {
    currentAttribute.value += c;
    return unQuotedAttributeValue;
  }
}

/**
 * 13.2.5.39 After attribute value (quoted) state https://html.spec.whatwg.org/multipage/parsing.html#after-attribute-value-(quoted)-state
 */
function afterQuotedAttributeValue(c) {
  if (c.match(REG_BLANK)) {
    return beforeAttributeName;
  } else if (c === "/") {
    return selfCloseStartTag;
  } else if (c === ">") {
    emit(currentToken);
    return data;
  } else if (c === EOF) {
    parseError(`This is an eof-in-tag parse error. Emit an end-of-file token.`);
    return;
  } else {
    parseError(
      `This is a missing-whitespace-between-attributes parse error. Reconsume in the before attribute name state.`
    );
    return;
  }
}

/**
 * 13.2.5.40 Self-closing start tag state https://html.spec.whatwg.org/multipage/parsing.html#self-closing-start-tag-state
 */
function selfCloseStartTag(c) {
  if (c === ">") {
    currentToken.isSelfClosing = true;
    emit(currentToken);
    return data;
  } else if (c === EOF) {
    parseError(`This is an eof-in-tag parse error. Emit an end-of-file token.`);
    return;
  } else {
    parseError(
      `This is an unexpected-solidus-in-tag parse error. Reconsume in the before attribute name state.`
    );
    return;
  }
}

function dontSupport() {
  throw new Error("Don't support lexical");
}

function parseError(reason) {
  throw new Error(reason);
}

module.exports.parseHTML = function parseHTML(html) {
  let state = data;
  for (let c of html) {
    state = state(c) || state;
  }
  state = state(EOF);
};
