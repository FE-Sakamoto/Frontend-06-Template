/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function(haystack, needle) {
  if (needle.length === 0) return 0
  return kmp(haystack, needle)
};

function kmp(source, pattern) {
  const table = Array(pattern.length).fill(0)
  {
    let i = 1, j = 0
    while(i < pattern.length) {
      if (pattern[i] === pattern[j]) {
        i++, j++
        table[i] = j
      } else {
        if (j > 0) {
          j = table[j]
        } else {
          i++
        }
      }
    }
  }

  {
    let i = 0, j = 0
    while(i < source.length) {
      if (pattern[j] === source[i]) {
        i++, j++
      } else {
        if (j > 0) {
          j = table[j]
        } else {
          i++
        }
      }
      if (j === pattern.length) {
        return i - pattern.length
      }
    }
    return -1
  }
}