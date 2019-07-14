import { Component } from '@angular/core';
import { IFibo } from './fibo-square/fibo-square.component';

export type direction = 'left' | 'bottom' | 'right' | 'top';
export enum DIRECTION {
  LEFT = 'left',
  BOTTOM = 'bottom',
  RIGHT = 'right',
  TOP = 'top'
}

let fiboRec = {};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  _mu_listener: EventListenerOrEventListenerObject;
  _mm_listener: EventListenerOrEventListenerObject;
  fiboCount = 0;
  firstFibo: Partial<IFibo> = {};
  constructor() {
    this.updateFibo();
  }

  isEmptyObject( obj ) {
    for (const name in obj ) {
      return false;
    }
    return true;
  }

  recurseTree(tree, newKey, newObj) {
    if(this.isEmptyObject(tree)) {
      tree[newKey] = {data: newObj};
      return;
    }

    let child = null; // find current tree's child
    for(const key in tree) {
      if (key != 'data') {
        child = tree[key]; // found a child
        break;
      }
    }
    if (child) { // recursively process on child
      this.recurseTree(child, newKey, newObj);
    } else { // no child, so just fill the tree
      tree[newKey] = {data: newObj};
    }
  }

  getScaleByCount(n) {
    if (n > 10 && n < 16) {
      return 'scale(.7)';
    }else if (n >= 16 && n < 17) {
      return 'scale(.25)';
    }else if (n >= 17 && n < 19) {
      return 'scale(.15)';
    }else if (n >= 19 && n < 20) {
      return 'scale(.05)';
    }else if (n >= 20 && n < 24) {
      return 'scale(.02)';
    }else if (n >= 24) {
      return 'scale(.001)';
    }else {
      return 'scale(1)'
    }
  }
  updateFibo() {
    let fibo = this.nextFiboAndDirection();
    this.recurseTree(fiboRec, 'children', fibo);
    this.firstFibo = fiboRec;
  }

  nextFiboAndDirection() {
    this.fiboCount++;
    const fibo = this.fibo(this.fiboCount);
    const dir = _nextFromEnum('direction', DIRECTION);
    return {
      fibo: fibo,
      dir: dir
    }
  }
  // fibo with memo
  memo = {};
  fibo(n) {
    let value;

    if (n in this.memo) {
      value = this.memo[n];
    } else {
      if (n === 0 || n === 1)
        value = n;
      else
        value = this.fibo(n - 1) + this.fibo(n - 2);

      this.memo[n] = value;
    }

    return value;
  }

  originalHtml: string;
  make3dDom(): void {
    const STEP = 50, PERSPECTIVE = '5000';
      const COLOURS = ["#C33", "#ea4c88", "#663399", "#0066cc", "#669900", "#ffcc33", "#ff9900", "#996633"];

      function getColour(depth) {
        return COLOURS[depth % (COLOURS.length - 1)]
      }

      function getFaceHTML(x, y, z, w, h, r, c) {
        const common = "position:absolute;-webkit-transform-origin: 0 0 0;";
        const visual = "background:" + c + ";";
        const dimensions = "width:" + w + "px; height:" + h + "px;";
        const translate = "translate3d(" + x + "px," + y + "px," + z + "px)";
        const rotate = "rotateX(" + 270 + "deg) rotateY(" + r + "deg)";
        const transform = "-webkit-transform:" + translate + rotate + ";";
        return  "<div style='" + common + visual + dimensions + transform + "'></div>";
      }

      const stepDelta = 0.001;
      let facesHTML = "";
      function traverse(element, depth, offsetLeft, offsetTop) {
        const childNodes = element.childNodes, l = childNodes.length;
        for (let i = 0; i < l; i++) {
          const childNode = childNodes[i];
          if (childNode.nodeType === 1) {
            childNode.style.overflow = 'visible';
            childNode.style.WebkitTransformStyle = 'preserve-3d';
            childNode.style.WebkitTransform = 'translateZ(' + (STEP + (l - i) * stepDelta).toFixed(3) + 'px)';

            let elementBodyOffsetLeft = offsetLeft,
              elementBodyOffsetTop = offsetTop;

            if (childNode.offsetParent === element) {
              elementBodyOffsetLeft += element.offsetLeft;
              elementBodyOffsetTop += element.offsetTop;
            }

            traverse(childNode, depth + 1, elementBodyOffsetLeft, elementBodyOffsetTop);

            // top
            facesHTML += getFaceHTML(elementBodyOffsetLeft + childNode.offsetLeft,
              elementBodyOffsetTop + childNode.offsetTop, (depth + 1) * STEP,
              childNode.offsetWidth, STEP, 0, getColour(depth));
            // right
            facesHTML += getFaceHTML(elementBodyOffsetLeft + childNode.offsetLeft + childNode.offsetWidth,
              elementBodyOffsetTop + childNode.offsetTop, (depth + 1) * STEP,
              childNode.offsetHeight, STEP, 270, getColour(depth));
            // bottom
            facesHTML += getFaceHTML(elementBodyOffsetLeft + childNode.offsetLeft,
              elementBodyOffsetTop + childNode.offsetTop + childNode.offsetHeight, (depth + 1) * STEP,
              childNode.offsetWidth, STEP, 0, getColour(depth));
            // left
            facesHTML += getFaceHTML(elementBodyOffsetLeft + childNode.offsetLeft,
              elementBodyOffsetTop + childNode.offsetTop, (depth + 1) * STEP,
              childNode.offsetHeight, STEP, 270, getColour(depth));
          }
        }
      }

      const body = document.body;
      this.originalHtml = body.innerHTML;
      body.style.overflow = 'visible';
      body.style.webkitTransformStyle = 'preserve-3d';
      body.style.webkitPerspective = PERSPECTIVE;

      const xCenter = (window.innerWidth/2).toFixed(2);
      const yCenter = (window.innerHeight/2).toFixed(2);
      body.style.webkitPerspectiveOrigin = body.style.webkitTransformOrigin = xCenter + "px " + yCenter +"px";

      traverse(body, 0, 0, 0);

      const faces = document.createElement("DIV");
      faces.classList.add('faces');
      faces.style.display = "none";
      faces.style.position = "absolute";
      faces.style.top = '0';
      faces.innerHTML = facesHTML;
      body.appendChild(faces);

      let mode = "NO_FACES";
      document.addEventListener("mousemove", this._mm_listener =  function _mm_listener (e) {
        if (mode !== "DISABLED") {
          const xrel = (e as any).screenX / screen.width;
          const yrel = 1 - ((e as any).screenY / screen.height);
          const xdeg = (yrel * 360 - 180).toFixed(2);
          const ydeg = (xrel * 360 - 180).toFixed(2);
          body.style.webkitTransform = "rotateX(" + xdeg + "deg) rotateY(" + ydeg + "deg)";
        }
      }, true);

      document.addEventListener("mouseup", this._mu_listener =  function _mu_listener (e) {
        switch (mode) {
          case "NO_FACES":
            mode = "FACES";
            faces.style.display = "";
            break;
          case "FACES":
            mode = "NO_FACES";
            faces.style.display = "none";
            break;
        }
      }, true);
  }
  getBodyBack() {
    document.querySelector('.faces').remove();
    document.removeEventListener('mousemove', this._mm_listener, true);
    document.removeEventListener('mouseup', this._mu_listener, true);
    document.body.removeAttribute('style');
    this.originalHtml = null;
  }
}

const enumCount = {};
function  _nextFromEnum(name: string, enumeration: any) {
  // if in use in other places in the future, better move to utils.service in shared folder.
  const values = Object.keys(enumeration);
  if (typeof enumCount[name] === 'undefined' || enumCount[name] === values.length - 1) {
    enumCount[name] = 0;
  } else {
    enumCount[name]++;
  }
  const enumKey = values[enumCount[name]];
  return enumeration[enumKey];
}
