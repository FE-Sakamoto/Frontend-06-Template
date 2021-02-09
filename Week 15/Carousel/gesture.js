export class Dispatcher{
  constructor(element) {
    this.element = element
  }
  dispatch(type, properties) {
    let event = new Event(type);
    for (let name in properties) {
      event[name] = properties[name];
    }
    this.element.dispatchEvent(event);
  }
}


export class Listener {
  constructor(element, recongnizer) {
    const contexts = new Map();
    let isListeningMouse = false;

    element.addEventListener("mousedown", (event) => {
      const context = Object.create(null);
      contexts.set("mouse" + (1 << event.button), context);
      recongnizer.start(event, context);
      function mouseMove(event) {
        let button = 1;
        while (button <= event.buttons) {
          if (button & event.buttons) {
            let key;
            if (button === 2) {
              key = 4;
            } else if (button === 4) {
              key = 2;
            } else {
              key = button;
            }
            let context = contexts.get("mouse" + key);
            recongnizer.move(event, context);
          }
          button = button << 1;
        }
        recongnizer.move(event, context);
      }

      function mouseUp(event) {
        const key = "mouse" + (1 << event.button);
        const context = contexts.get(key);
        recongnizer.end(event, context);
        contexts.delete(key);
        if (event.buttons === 0) {
          element.removeEventListener("mousemove", mouseMove);
          element.removeEventListener("mouseup", mouseUp);
          isListeningMouse = false;
        }
      }

      if (!isListeningMouse) {
        element.addEventListener("mousemove", mouseMove);
        element.addEventListener("mouseup", mouseUp);
        isListeningMouse = true;
      }
    });

    element.addEventListener("touchstart", (event) => {
      for (let touch of event.changedTouches) {
        const context = Object.create(null);
        contexts.set(touch.identifier, context);
        recongnizer.start(touch, context);
      }
    });
    element.addEventListener("touchmove", (event) => {
      for (let touch of event.changedTouches) {
        recongnizer.move(touch, contexts.get(touch.identifier));
      }
    });
    element.addEventListener("touchend", (event) => {
      for (let touch of event.changedTouches) {
        recongnizer.end(touch, contexts.get(touch.identifier));
        contexts.delete(touch.identifier);
      }
    });
    element.addEventListener("touchcancel", (event) => {
      for (let touch of event.changedTouches) {
        recongnizer.cancel(touch, contexts.get(touch.identifier));
        contexts.delete(touch.identifier);
      }
    });
  }
}

export class Recongnizer {
  constructor(dispatcher){
    this.dispatch = dispatcher.dispatch.bind(dispatcher)
  }
  start(point, context) {
    context.gustureType = 'tap';
    context.startX = point.clientX;
    context.startY = point.clientY;
    context.points = [
      {
        t: Date.now(),
        x: point.clientX,
        y: point.clientY,
      },
    ];
    context.handler = setTimeout(() => {
      context.handler = null;
      context.gustureType = 'press';
      this.dispatch('press', {})
    }, 500);
  }
  
  move(point, context) {
    let dx = point.clientX - context.startX,
      dy = point.clientY - context.startY;
    if (context.gustureType !== 'pan' && dx ** 2 + dy ** 2 > 100) {
      context.gustureType = 'pan';
      context.isVertical = Math.abs(dx) < Math.abs(dy)
      clearTimeout(context.handler);
      this.dispatch('panstart', {
        startX: context.startX,
        startY: context.startY,
        isVertical: context.isVertical,
        clientX: point.clientX,
        clientY: point.clientY,
      })
    }
    if (context.gustureType === 'pan') {
      const now = Date.now();
      context.points = context.points.filter((point) => now - point.t < 500);
      context.points.push({
        t: now,
        x: point.clientX,
        y: point.clientY,
      });
      this.dispatch('pan', {
        startX: context.startX,
        startY: context.startY,
        isVertical: context.isVertical,
        clientX: point.clientX,
        clientY: point.clientY,
      })
    }
  }
  
  end(point, context) {
    clearTimeout(context.handler);
    if (context.gustureType === 'tap') {
      this.dispatch('tapend', {});
    }
    if (context.gustureType === 'press') {
      this.dispatch('pressend', {})
    }
    if (context.gustureType === 'pan') {
      const now = Date.now();
      context.points = context.points.filter((point) => now - point.t < 500);
      let v;
      if (context.points.length) {
        const d = Math.sqrt(
          (point.clientX - context.points[0].x) ** 2 +
            (point.clientY - context.points[0].y)
        );
        v = d / (now - context.points[0].t);
      } else {
        v = 0
      }
      context.isFlick = v > 1.5

      this.dispatch('panend', {
        startX: context.startX,
        startY: context.startY,
        isVertical: context.isVertical,
        isFlick: context.isFlick,
        clientX: point.clientX,
        clientY: point.clientY,
      })
    }
  }
  
  cancel(point, context) {
    clearTimeout(context.handler);
    if (context.gustureType === 'press') {
      this.dispatch('presscancel', {})
    }
    if (context.gustureType === 'pan') {
      this.dispatch('panend', {
        startX: context.startX,
        startY: context.startY,
        isVertical: context.isVertical,
        clientX: point.clientX,
        clientY: point.clientY,
      })
    }
  }
}

export function enableGusture(element) {
  new Listener(element, new Recongnizer(new Dispatcher(element)))
}

enableGusture(document.documentElement)

document.documentElement.addEventListener("press", (event) => {
  console.log("press", event);
});
document.documentElement.addEventListener("panstart", (event) => {
  console.log("panstart", event);
});
document.documentElement.addEventListener("pan", (event) => {
  console.log("pan", event);
});
document.documentElement.addEventListener("tapend", (event) => {
  console.log("tapend", event);
});
document.documentElement.addEventListener("pressend", (event) => {
  console.log("pressend", event);
});
document.documentElement.addEventListener("presscancel", (event) => {
  console.log("presscancel", event);
});
document.documentElement.addEventListener("panend", (event) => {
  console.log("panend", event);
});




