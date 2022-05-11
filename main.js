/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/styles/index.scss":
/*!*******************************!*\
  !*** ./src/styles/index.scss ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/constants/settings.ts":
/*!***********************************!*\
  !*** ./src/constants/settings.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.settings = void 0;
const CANVAS_SIZE = 640;
const DIMENSION = 16; // 25bug
const GAP = 1; // 0.5bug
const GAME_SPEED = 200;
const FRUITS_QTY_AT_MOMENT = 2;
const CELL_SIZE = CANVAS_SIZE / DIMENSION;
const RECT_CELL_SIZE = CELL_SIZE - GAP * 2;
const CANVAS_CENTER_CELL_POSITION = GAP * Math.ceil(CANVAS_SIZE / 2 / GAP);
const INITIAL_SNAKE_POSITION = { x: CANVAS_CENTER_CELL_POSITION, y: CANVAS_CENTER_CELL_POSITION };
const PALETTE = {
    secondaryColor: 'rgb(130, 178, 44)',
    secondaryColorsB: ['#6C0AAB', '#5D2680', '#45036F', '#9A3FD5', '#AA67D5'],
    primaryColors: ['#FF9200', '#BF8230', '#A65F00', '#FFAD40', '#FFC373'],
    whiteColor: 'rgb(250, 250, 250)',
    experimental: 'rgba(206, 206, 206, 0.4)'
};
const BACKGROUND_CELL_COLOR = PALETTE.experimental;
const BACKGROUND_COLOR = PALETTE.whiteColor;
const SNAKE_COLOR = PALETTE.secondaryColor;
const FRUIT_COLOR = PALETTE.secondaryColorsB[2];
exports.settings = {
    // game
    CANVAS_SIZE,
    DIMENSION,
    GAP,
    GAME_SPEED,
    FRUITS_QTY_AT_MOMENT,
    // cell size & position
    CELL_SIZE,
    RECT_CELL_SIZE,
    INITIAL_SNAKE_POSITION,
    // colors
    PALETTE,
    BACKGROUND_CELL_COLOR,
    BACKGROUND_COLOR,
    SNAKE_COLOR,
    FRUIT_COLOR
};


/***/ }),

/***/ "./src/game/bootstrap.ts":
/*!*******************************!*\
  !*** ./src/game/bootstrap.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.start = void 0;
const settings_1 = __webpack_require__(/*! ../constants/settings */ "./src/constants/settings.ts");
const interfaces_1 = __webpack_require__(/*! ../interfaces */ "./src/interfaces/index.ts");
const field_1 = __webpack_require__(/*! ./canvasElements/field */ "./src/game/canvasElements/field.ts");
const snake_1 = __webpack_require__(/*! ./canvasElements/snake */ "./src/game/canvasElements/snake.ts");
const frame_1 = __webpack_require__(/*! ./frame */ "./src/game/frame.ts");
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
if (!context)
    throw 'No context for canvas';
console.log('loading game...');
let direction;
canvas.focus();
const field = new field_1.Field(context);
field.draw();
const snake = new snake_1.Snake(context);
snake.draw();
let requestId;
let startTime = new Date().getTime();
let lastAplliedDirection = null;
function loop() {
    const deltaTime = new Date().getTime() - startTime;
    if (deltaTime > settings_1.settings.GAME_SPEED) {
        startTime = new Date().getTime();
        const result = (0, frame_1.frame)(context, snake, field, direction);
        lastAplliedDirection = direction;
        if (!result) {
            alert('you lose');
            cancelAnimationFrame(requestId);
            return;
        }
    }
    requestId = requestAnimationFrame(loop);
}
const setEvents = () => {
    const allowableKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    let lastPressedKey = null;
    let isGameStarted = false;
    document.addEventListener('keydown', e => {
        if (!allowableKeys.includes(e.key))
            return;
        if (lastPressedKey === e.key)
            return;
        lastPressedKey = e.key;
        switch (e.key) {
            case 'ArrowLeft': {
                direction = lastAplliedDirection !== null
                    && lastAplliedDirection === interfaces_1.Direction.Right
                    ? interfaces_1.Direction.Right
                    : interfaces_1.Direction.Left;
                break;
            }
            case 'ArrowUp': {
                direction = lastAplliedDirection !== null
                    && lastAplliedDirection === interfaces_1.Direction.Down
                    ? interfaces_1.Direction.Down
                    : interfaces_1.Direction.Up;
                break;
            }
            case 'ArrowRight': {
                direction = lastAplliedDirection !== null
                    && lastAplliedDirection === interfaces_1.Direction.Left
                    ? interfaces_1.Direction.Left
                    : interfaces_1.Direction.Right;
                break;
            }
            case 'ArrowDown': {
                direction = lastAplliedDirection !== null
                    && lastAplliedDirection === interfaces_1.Direction.Up
                    ? interfaces_1.Direction.Up
                    : interfaces_1.Direction.Down;
                break;
            }
        }
        if (!isGameStarted) {
            console.log('starting game...');
            loop();
            isGameStarted = true;
        }
    });
};
const start = () => {
    setEvents();
};
exports.start = start;


/***/ }),

/***/ "./src/game/canvasElements/canvasElement.ts":
/*!**************************************************!*\
  !*** ./src/game/canvasElements/canvasElement.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CanvasElement = void 0;
const settings_1 = __webpack_require__(/*! ../../constants/settings */ "./src/constants/settings.ts");
class CanvasElement {
    constructor(context) {
        this.context = context;
    }
    updateFillStyle(color) {
        this.context.fillStyle = color;
    }
    drawCell(coords) {
        this.context.fillRect(settings_1.settings.GAP + coords.x, settings_1.settings.GAP + coords.y, settings_1.settings.RECT_CELL_SIZE, settings_1.settings.RECT_CELL_SIZE);
    }
}
exports.CanvasElement = CanvasElement;


/***/ }),

/***/ "./src/game/canvasElements/field.ts":
/*!******************************************!*\
  !*** ./src/game/canvasElements/field.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Field = void 0;
const settings_1 = __webpack_require__(/*! ../../constants/settings */ "./src/constants/settings.ts");
const canvasElement_1 = __webpack_require__(/*! ./canvasElement */ "./src/game/canvasElements/canvasElement.ts");
const fruitList_1 = __webpack_require__(/*! ./fruitList */ "./src/game/canvasElements/fruitList.ts");
let mockFruitsStack = [
    { x: settings_1.settings.CELL_SIZE * 5, y: settings_1.settings.CELL_SIZE },
    { x: settings_1.settings.CELL_SIZE, y: settings_1.settings.CELL_SIZE * 2 },
    { x: settings_1.settings.CELL_SIZE, y: settings_1.settings.CELL_SIZE },
    { x: settings_1.settings.CELL_SIZE * 6, y: settings_1.settings.CELL_SIZE * 7 },
    { x: settings_1.settings.CELL_SIZE * 3, y: settings_1.settings.CELL_SIZE * 3 },
    { x: settings_1.settings.CELL_SIZE * 8, y: settings_1.settings.CELL_SIZE * 2 },
    { x: 0, y: 0 }
];
// background and fruits management
class Field extends canvasElement_1.CanvasElement {
    constructor(context) {
        super(context);
        this.fruitList = new fruitList_1.FruitList(context);
        this.occupiedSlots = [settings_1.settings.INITIAL_SNAKE_POSITION];
        this._spawnFruits(settings_1.settings.FRUITS_QTY_AT_MOMENT);
    }
    draw() {
        this._drawBackPart();
        this._drawFrontPart();
        this.fruitList.draw();
    }
    /**
     * Updates inner ocuppied array and notifies about collapse
     * @param slots Snake's slots on field
     * @returns Collapse flag :: if snake ate fruit it returns true; otherwise false
     */
    updateOccupiedSlots(slots) {
        this.occupiedSlots.splice(0, this.occupiedSlots.length - 1, ...slots);
        const isFruitEaten = this.fruitList.has(slots[0]);
        if (isFruitEaten) {
            this.fruitList.remove(slots[0]);
            this._spawnFruits(1);
        }
        return isFruitEaten;
    }
    // background
    _drawBackPart() {
        super.updateFillStyle(settings_1.settings.BACKGROUND_COLOR);
        this.context.fillRect(0, 0, settings_1.settings.CANVAS_SIZE, settings_1.settings.CANVAS_SIZE);
    }
    // cells
    _drawFrontPart() {
        super.updateFillStyle(settings_1.settings.BACKGROUND_CELL_COLOR);
        for (let i = 0; i < settings_1.settings.DIMENSION; i++) {
            for (let j = 0; j < settings_1.settings.DIMENSION; j++) {
                super.drawCell({
                    x: settings_1.settings.CELL_SIZE * i,
                    y: settings_1.settings.CELL_SIZE * j
                });
            }
        }
    }
    _getFreeSlots() {
        const freeSlots = [];
        for (let i = 0; i < settings_1.settings.DIMENSION; i++) {
            for (let j = 0; j < settings_1.settings.DIMENSION; j++) {
                const currSlotCoords = {
                    x: settings_1.settings.CELL_SIZE * i,
                    y: settings_1.settings.CELL_SIZE * j
                };
                const isCurrSlotOccupied = this.occupiedSlots.some(slotCoords => slotCoords.x === currSlotCoords.x
                    && slotCoords.y === currSlotCoords.y);
                const isCurrSlotFruit = this.fruitList.has(currSlotCoords);
                if (!isCurrSlotOccupied && !isCurrSlotFruit) {
                    freeSlots.push(currSlotCoords);
                }
            }
        }
        return freeSlots;
    }
    _spawnFruits(fruitsQty) {
        const freeSlots = this._getFreeSlots();
        const randomize = (min, max) => Math.round((Math.random() * (max - min)) + min);
        for (let i = 0; i < fruitsQty; i++) {
            if (mockFruitsStack.length === 0)
                return;
            const idx = randomize(0, freeSlots.length - 1);
            this.fruitList.add(freeSlots[idx]);
            freeSlots.splice(idx, 1);
        }
    }
}
exports.Field = Field;


/***/ }),

/***/ "./src/game/canvasElements/fruitItem.ts":
/*!**********************************************!*\
  !*** ./src/game/canvasElements/fruitItem.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FruitItem = void 0;
const settings_1 = __webpack_require__(/*! ../../constants/settings */ "./src/constants/settings.ts");
const canvasElement_1 = __webpack_require__(/*! ./canvasElement */ "./src/game/canvasElements/canvasElement.ts");
class FruitItem extends canvasElement_1.CanvasElement {
    constructor(context, position) {
        super(context);
        this._position = position;
    }
    /**
     * Draws fruit
     */
    draw() {
        super.updateFillStyle(settings_1.settings.FRUIT_COLOR);
        this.drawCell(this._position);
    }
    /**
     * Returns fruit coords
     * @returns
     */
    getCoords() {
        return this._position;
    }
}
exports.FruitItem = FruitItem;


/***/ }),

/***/ "./src/game/canvasElements/fruitList.ts":
/*!**********************************************!*\
  !*** ./src/game/canvasElements/fruitList.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FruitList = void 0;
const canvasElement_1 = __webpack_require__(/*! ./canvasElement */ "./src/game/canvasElements/canvasElement.ts");
const fruitItem_1 = __webpack_require__(/*! ./fruitItem */ "./src/game/canvasElements/fruitItem.ts");
class FruitList extends canvasElement_1.CanvasElement {
    constructor(context) {
        super(context);
        this.fruitList = [];
    }
    /**
     * Draws fruits
     */
    draw() {
        this.fruitList.forEach(fruit => fruit.draw());
    }
    getLength() {
        return this.fruitList.length;
    }
    /**
     * Checks for fruit existance by coords
     * @param {ICoords} fruitCoords Fruit coords
     * @returns isExist flag
     */
    has(fruitCoords) {
        return this.fruitList.some(fruit => {
            const currFruitCoords = fruit.getCoords();
            return currFruitCoords.x === fruitCoords.x
                && currFruitCoords.y === fruitCoords.y;
        });
    }
    /**
     * Adds fruit by coords
     * @param {ICoords} fruitCoords Fruit Coords
     */
    add(fruitCoords) {
        const fruit = new fruitItem_1.FruitItem(this.context, fruitCoords);
        this.fruitList.push(fruit);
    }
    /**
     * Removes fruit for list by coords
     * @param {ICoords} fruitCoords Fruit coords
     */
    remove(fruitCoords) {
        const removeIdx = this.fruitList.findIndex(fruit => {
            const currFruitCoords = fruit.getCoords();
            return currFruitCoords.x === fruitCoords.x
                && currFruitCoords.y === fruitCoords.y;
        });
        this.fruitList.splice(removeIdx, 1);
    }
}
exports.FruitList = FruitList;


/***/ }),

/***/ "./src/game/canvasElements/snake.ts":
/*!******************************************!*\
  !*** ./src/game/canvasElements/snake.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Snake = void 0;
const settings_1 = __webpack_require__(/*! ../../constants/settings */ "./src/constants/settings.ts");
const interfaces_1 = __webpack_require__(/*! ../../interfaces */ "./src/interfaces/index.ts");
const canvasElement_1 = __webpack_require__(/*! ./canvasElement */ "./src/game/canvasElements/canvasElement.ts");
class Snake extends canvasElement_1.CanvasElement {
    constructor(context) {
        super(context);
        this._stomach = [];
        this._tail = [];
        super.updateFillStyle(settings_1.settings.SNAKE_COLOR);
        this.headPosition = settings_1.settings.INITIAL_SNAKE_POSITION;
    }
    draw() {
        super.updateFillStyle(settings_1.settings.SNAKE_COLOR);
        this.drawCell(this.headPosition);
        this._tail.forEach(this.drawCell.bind(this));
    }
    crawl(position, hasFruit) {
        this._tail.unshift(this.headPosition);
        let removeIdx = -1;
        const digestedFruitCoords = this._stomach.find((fruitPosition, idx) => {
            const x = this._tail.length ? this._tail.at(-1).x : this.headPosition.x;
            const y = this._tail.length ? this._tail.at(-1).y : this.headPosition.y;
            const isDigested = fruitPosition.x === x && fruitPosition.y === y;
            if (isDigested)
                removeIdx = idx;
            return isDigested;
        });
        if (digestedFruitCoords)
            this._stomach.splice(removeIdx, 1);
        else
            this._tail.pop();
        this.headPosition = position;
        if (hasFruit)
            this._stomach.push(position);
    }
    /**
     * Calculates next snake slots or notifies about crash
     * @param direction snake's direction :: up, down, left, right
     * @returns false if snake ate itself; otherwise next snake slots
     */
    getNextSnakeSlots(direction) {
        let headPosition;
        switch (direction) {
            case interfaces_1.Direction.Up: {
                const potentialPositionY = this.headPosition.y - settings_1.settings.CELL_SIZE;
                headPosition = {
                    x: this.headPosition.x,
                    y: potentialPositionY < 0
                        ? settings_1.settings.CANVAS_SIZE - settings_1.settings.CELL_SIZE
                        : potentialPositionY
                };
                break;
            }
            case interfaces_1.Direction.Down: {
                const potentialPositionY = this.headPosition.y + settings_1.settings.CELL_SIZE;
                headPosition = {
                    x: this.headPosition.x,
                    y: potentialPositionY + settings_1.settings.CELL_SIZE > settings_1.settings.CANVAS_SIZE
                        ? 0
                        : potentialPositionY
                };
                break;
            }
            case interfaces_1.Direction.Left: {
                const potentialPositionX = this.headPosition.x - settings_1.settings.CELL_SIZE;
                headPosition = {
                    x: potentialPositionX < 0
                        ? settings_1.settings.CANVAS_SIZE - settings_1.settings.CELL_SIZE
                        : potentialPositionX,
                    y: this.headPosition.y
                };
                break;
            }
            case interfaces_1.Direction.Right: {
                const potentialPositionX = this.headPosition.x + settings_1.settings.CELL_SIZE;
                headPosition = {
                    x: potentialPositionX + settings_1.settings.CELL_SIZE > settings_1.settings.CANVAS_SIZE
                        ? 0
                        : potentialPositionX,
                    y: this.headPosition.y
                };
                break;
            }
        }
        // ate itself
        if (this._tail.some(p => p.x === headPosition.x
            && p.y === headPosition.y))
            return false;
        // next snake slots
        return [headPosition, this.headPosition, ...this._tail.slice(0, -1)];
    }
}
exports.Snake = Snake;


/***/ }),

/***/ "./src/game/frame.ts":
/*!***************************!*\
  !*** ./src/game/frame.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.frame = void 0;
const settings_1 = __webpack_require__(/*! ../constants/settings */ "./src/constants/settings.ts");
function frame(context, snake, field, direction) {
    const snakeSlots = snake.getNextSnakeSlots(direction);
    if (!snakeSlots)
        return false;
    context.clearRect(0, 0, settings_1.settings.CANVAS_SIZE, settings_1.settings.CANVAS_SIZE);
    const isFruitEaten = field.updateOccupiedSlots(snakeSlots);
    field.draw();
    snake.crawl(snakeSlots[0], isFruitEaten);
    snake.draw();
    return true;
}
exports.frame = frame;


/***/ }),

/***/ "./src/interfaces/index.ts":
/*!*********************************!*\
  !*** ./src/interfaces/index.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Direction = void 0;
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = 2] = "Left";
    Direction[Direction["Right"] = 3] = "Right";
})(Direction = exports.Direction || (exports.Direction = {}));


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const bootstrap_1 = __webpack_require__(/*! ./game/bootstrap */ "./src/game/bootstrap.ts");
__webpack_require__(/*! ./styles/index.scss */ "./src/styles/index.scss");
(0, bootstrap_1.start)();


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	__webpack_require__("./src/main.ts");
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/styles/index.scss");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7OztBQ0FhO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGdCQUFnQjtBQUNoQjtBQUNBLHNCQUFzQjtBQUN0QixlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDeENhO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGFBQWE7QUFDYixtQkFBbUIsbUJBQU8sQ0FBQywwREFBdUI7QUFDbEQscUJBQXFCLG1CQUFPLENBQUMsZ0RBQWU7QUFDNUMsZ0JBQWdCLG1CQUFPLENBQUMsa0VBQXdCO0FBQ2hELGdCQUFnQixtQkFBTyxDQUFDLGtFQUF3QjtBQUNoRCxnQkFBZ0IsbUJBQU8sQ0FBQyxvQ0FBUztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7Ozs7Ozs7Ozs7O0FDdEZBO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELHFCQUFxQjtBQUNyQixtQkFBbUIsbUJBQU8sQ0FBQyw2REFBMEI7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjs7Ozs7Ozs7Ozs7QUNmUjtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxhQUFhO0FBQ2IsbUJBQW1CLG1CQUFPLENBQUMsNkRBQTBCO0FBQ3JELHdCQUF3QixtQkFBTyxDQUFDLG1FQUFpQjtBQUNqRCxvQkFBb0IsbUJBQU8sQ0FBQywyREFBYTtBQUN6QztBQUNBLE1BQU0sd0VBQXdFO0FBQzlFLE1BQU0sd0VBQXdFO0FBQzlFLE1BQU0sb0VBQW9FO0FBQzFFLE1BQU0sNEVBQTRFO0FBQ2xGLE1BQU0sNEVBQTRFO0FBQ2xGLE1BQU0sNEVBQTRFO0FBQ2xGLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUVBQXFFO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixtQ0FBbUM7QUFDM0QsNEJBQTRCLG1DQUFtQztBQUMvRDtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixtQ0FBbUM7QUFDM0QsNEJBQTRCLG1DQUFtQztBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGVBQWU7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7Ozs7Ozs7Ozs7O0FDekZBO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGlCQUFpQjtBQUNqQixtQkFBbUIsbUJBQU8sQ0FBQyw2REFBMEI7QUFDckQsd0JBQXdCLG1CQUFPLENBQUMsbUVBQWlCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7Ozs7Ozs7Ozs7O0FDekJKO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGlCQUFpQjtBQUNqQix3QkFBd0IsbUJBQU8sQ0FBQyxtRUFBaUI7QUFDakQsb0JBQW9CLG1CQUFPLENBQUMsMkRBQWE7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFNBQVM7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsZUFBZSxTQUFTO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxTQUFTO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7Ozs7Ozs7Ozs7O0FDcERKO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGFBQWE7QUFDYixtQkFBbUIsbUJBQU8sQ0FBQyw2REFBMEI7QUFDckQscUJBQXFCLG1CQUFPLENBQUMsbURBQWtCO0FBQy9DLHdCQUF3QixtQkFBTyxDQUFDLG1FQUFpQjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7Ozs7Ozs7Ozs7O0FDL0ZBO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGFBQWE7QUFDYixtQkFBbUIsbUJBQU8sQ0FBQywwREFBdUI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7Ozs7Ozs7Ozs7O0FDZkE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsb0NBQW9DLGlCQUFpQixLQUFLOzs7Ozs7Ozs7OztBQ1Q5QztBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxvQkFBb0IsbUJBQU8sQ0FBQyxpREFBa0I7QUFDOUMsbUJBQU8sQ0FBQyxvREFBcUI7QUFDN0I7Ozs7Ozs7VUNKQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1VFTkE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3NuYWtlLy4vc3JjL3N0eWxlcy9pbmRleC5zY3NzPzM4YTUiLCJ3ZWJwYWNrOi8vc25ha2UvLi9zcmMvY29uc3RhbnRzL3NldHRpbmdzLnRzIiwid2VicGFjazovL3NuYWtlLy4vc3JjL2dhbWUvYm9vdHN0cmFwLnRzIiwid2VicGFjazovL3NuYWtlLy4vc3JjL2dhbWUvY2FudmFzRWxlbWVudHMvY2FudmFzRWxlbWVudC50cyIsIndlYnBhY2s6Ly9zbmFrZS8uL3NyYy9nYW1lL2NhbnZhc0VsZW1lbnRzL2ZpZWxkLnRzIiwid2VicGFjazovL3NuYWtlLy4vc3JjL2dhbWUvY2FudmFzRWxlbWVudHMvZnJ1aXRJdGVtLnRzIiwid2VicGFjazovL3NuYWtlLy4vc3JjL2dhbWUvY2FudmFzRWxlbWVudHMvZnJ1aXRMaXN0LnRzIiwid2VicGFjazovL3NuYWtlLy4vc3JjL2dhbWUvY2FudmFzRWxlbWVudHMvc25ha2UudHMiLCJ3ZWJwYWNrOi8vc25ha2UvLi9zcmMvZ2FtZS9mcmFtZS50cyIsIndlYnBhY2s6Ly9zbmFrZS8uL3NyYy9pbnRlcmZhY2VzL2luZGV4LnRzIiwid2VicGFjazovL3NuYWtlLy4vc3JjL21haW4udHMiLCJ3ZWJwYWNrOi8vc25ha2Uvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vc25ha2Uvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9zbmFrZS93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL3NuYWtlL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9zbmFrZS93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5zZXR0aW5ncyA9IHZvaWQgMDtcclxuY29uc3QgQ0FOVkFTX1NJWkUgPSA2NDA7XHJcbmNvbnN0IERJTUVOU0lPTiA9IDE2OyAvLyAyNWJ1Z1xyXG5jb25zdCBHQVAgPSAxOyAvLyAwLjVidWdcclxuY29uc3QgR0FNRV9TUEVFRCA9IDIwMDtcclxuY29uc3QgRlJVSVRTX1FUWV9BVF9NT01FTlQgPSAyO1xyXG5jb25zdCBDRUxMX1NJWkUgPSBDQU5WQVNfU0laRSAvIERJTUVOU0lPTjtcclxuY29uc3QgUkVDVF9DRUxMX1NJWkUgPSBDRUxMX1NJWkUgLSBHQVAgKiAyO1xyXG5jb25zdCBDQU5WQVNfQ0VOVEVSX0NFTExfUE9TSVRJT04gPSBHQVAgKiBNYXRoLmNlaWwoQ0FOVkFTX1NJWkUgLyAyIC8gR0FQKTtcclxuY29uc3QgSU5JVElBTF9TTkFLRV9QT1NJVElPTiA9IHsgeDogQ0FOVkFTX0NFTlRFUl9DRUxMX1BPU0lUSU9OLCB5OiBDQU5WQVNfQ0VOVEVSX0NFTExfUE9TSVRJT04gfTtcclxuY29uc3QgUEFMRVRURSA9IHtcclxuICAgIHNlY29uZGFyeUNvbG9yOiAncmdiKDEzMCwgMTc4LCA0NCknLFxyXG4gICAgc2Vjb25kYXJ5Q29sb3JzQjogWycjNkMwQUFCJywgJyM1RDI2ODAnLCAnIzQ1MDM2RicsICcjOUEzRkQ1JywgJyNBQTY3RDUnXSxcclxuICAgIHByaW1hcnlDb2xvcnM6IFsnI0ZGOTIwMCcsICcjQkY4MjMwJywgJyNBNjVGMDAnLCAnI0ZGQUQ0MCcsICcjRkZDMzczJ10sXHJcbiAgICB3aGl0ZUNvbG9yOiAncmdiKDI1MCwgMjUwLCAyNTApJyxcclxuICAgIGV4cGVyaW1lbnRhbDogJ3JnYmEoMjA2LCAyMDYsIDIwNiwgMC40KSdcclxufTtcclxuY29uc3QgQkFDS0dST1VORF9DRUxMX0NPTE9SID0gUEFMRVRURS5leHBlcmltZW50YWw7XHJcbmNvbnN0IEJBQ0tHUk9VTkRfQ09MT1IgPSBQQUxFVFRFLndoaXRlQ29sb3I7XHJcbmNvbnN0IFNOQUtFX0NPTE9SID0gUEFMRVRURS5zZWNvbmRhcnlDb2xvcjtcclxuY29uc3QgRlJVSVRfQ09MT1IgPSBQQUxFVFRFLnNlY29uZGFyeUNvbG9yc0JbMl07XHJcbmV4cG9ydHMuc2V0dGluZ3MgPSB7XHJcbiAgICAvLyBnYW1lXHJcbiAgICBDQU5WQVNfU0laRSxcclxuICAgIERJTUVOU0lPTixcclxuICAgIEdBUCxcclxuICAgIEdBTUVfU1BFRUQsXHJcbiAgICBGUlVJVFNfUVRZX0FUX01PTUVOVCxcclxuICAgIC8vIGNlbGwgc2l6ZSAmIHBvc2l0aW9uXHJcbiAgICBDRUxMX1NJWkUsXHJcbiAgICBSRUNUX0NFTExfU0laRSxcclxuICAgIElOSVRJQUxfU05BS0VfUE9TSVRJT04sXHJcbiAgICAvLyBjb2xvcnNcclxuICAgIFBBTEVUVEUsXHJcbiAgICBCQUNLR1JPVU5EX0NFTExfQ09MT1IsXHJcbiAgICBCQUNLR1JPVU5EX0NPTE9SLFxyXG4gICAgU05BS0VfQ09MT1IsXHJcbiAgICBGUlVJVF9DT0xPUlxyXG59O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLnN0YXJ0ID0gdm9pZCAwO1xyXG5jb25zdCBzZXR0aW5nc18xID0gcmVxdWlyZShcIi4uL2NvbnN0YW50cy9zZXR0aW5nc1wiKTtcclxuY29uc3QgaW50ZXJmYWNlc18xID0gcmVxdWlyZShcIi4uL2ludGVyZmFjZXNcIik7XHJcbmNvbnN0IGZpZWxkXzEgPSByZXF1aXJlKFwiLi9jYW52YXNFbGVtZW50cy9maWVsZFwiKTtcclxuY29uc3Qgc25ha2VfMSA9IHJlcXVpcmUoXCIuL2NhbnZhc0VsZW1lbnRzL3NuYWtlXCIpO1xyXG5jb25zdCBmcmFtZV8xID0gcmVxdWlyZShcIi4vZnJhbWVcIik7XHJcbmNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKTtcclxuY29uc3QgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG5pZiAoIWNvbnRleHQpXHJcbiAgICB0aHJvdyAnTm8gY29udGV4dCBmb3IgY2FudmFzJztcclxuY29uc29sZS5sb2coJ2xvYWRpbmcgZ2FtZS4uLicpO1xyXG5sZXQgZGlyZWN0aW9uO1xyXG5jYW52YXMuZm9jdXMoKTtcclxuY29uc3QgZmllbGQgPSBuZXcgZmllbGRfMS5GaWVsZChjb250ZXh0KTtcclxuZmllbGQuZHJhdygpO1xyXG5jb25zdCBzbmFrZSA9IG5ldyBzbmFrZV8xLlNuYWtlKGNvbnRleHQpO1xyXG5zbmFrZS5kcmF3KCk7XHJcbmxldCByZXF1ZXN0SWQ7XHJcbmxldCBzdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxubGV0IGxhc3RBcGxsaWVkRGlyZWN0aW9uID0gbnVsbDtcclxuZnVuY3Rpb24gbG9vcCgpIHtcclxuICAgIGNvbnN0IGRlbHRhVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gc3RhcnRUaW1lO1xyXG4gICAgaWYgKGRlbHRhVGltZSA+IHNldHRpbmdzXzEuc2V0dGluZ3MuR0FNRV9TUEVFRCkge1xyXG4gICAgICAgIHN0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9ICgwLCBmcmFtZV8xLmZyYW1lKShjb250ZXh0LCBzbmFrZSwgZmllbGQsIGRpcmVjdGlvbik7XHJcbiAgICAgICAgbGFzdEFwbGxpZWREaXJlY3Rpb24gPSBkaXJlY3Rpb247XHJcbiAgICAgICAgaWYgKCFyZXN1bHQpIHtcclxuICAgICAgICAgICAgYWxlcnQoJ3lvdSBsb3NlJyk7XHJcbiAgICAgICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHJlcXVlc3RJZCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXF1ZXN0SWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XHJcbn1cclxuY29uc3Qgc2V0RXZlbnRzID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYWxsb3dhYmxlS2V5cyA9IFsnQXJyb3dVcCcsICdBcnJvd0Rvd24nLCAnQXJyb3dMZWZ0JywgJ0Fycm93UmlnaHQnXTtcclxuICAgIGxldCBsYXN0UHJlc3NlZEtleSA9IG51bGw7XHJcbiAgICBsZXQgaXNHYW1lU3RhcnRlZCA9IGZhbHNlO1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGUgPT4ge1xyXG4gICAgICAgIGlmICghYWxsb3dhYmxlS2V5cy5pbmNsdWRlcyhlLmtleSkpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBpZiAobGFzdFByZXNzZWRLZXkgPT09IGUua2V5KVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgbGFzdFByZXNzZWRLZXkgPSBlLmtleTtcclxuICAgICAgICBzd2l0Y2ggKGUua2V5KSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ0Fycm93TGVmdCc6IHtcclxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbiA9IGxhc3RBcGxsaWVkRGlyZWN0aW9uICE9PSBudWxsXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgbGFzdEFwbGxpZWREaXJlY3Rpb24gPT09IGludGVyZmFjZXNfMS5EaXJlY3Rpb24uUmlnaHRcclxuICAgICAgICAgICAgICAgICAgICA/IGludGVyZmFjZXNfMS5EaXJlY3Rpb24uUmlnaHRcclxuICAgICAgICAgICAgICAgICAgICA6IGludGVyZmFjZXNfMS5EaXJlY3Rpb24uTGVmdDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgJ0Fycm93VXAnOiB7XHJcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb24gPSBsYXN0QXBsbGllZERpcmVjdGlvbiAhPT0gbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgICYmIGxhc3RBcGxsaWVkRGlyZWN0aW9uID09PSBpbnRlcmZhY2VzXzEuRGlyZWN0aW9uLkRvd25cclxuICAgICAgICAgICAgICAgICAgICA/IGludGVyZmFjZXNfMS5EaXJlY3Rpb24uRG93blxyXG4gICAgICAgICAgICAgICAgICAgIDogaW50ZXJmYWNlc18xLkRpcmVjdGlvbi5VcDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgJ0Fycm93UmlnaHQnOiB7XHJcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb24gPSBsYXN0QXBsbGllZERpcmVjdGlvbiAhPT0gbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgICYmIGxhc3RBcGxsaWVkRGlyZWN0aW9uID09PSBpbnRlcmZhY2VzXzEuRGlyZWN0aW9uLkxlZnRcclxuICAgICAgICAgICAgICAgICAgICA/IGludGVyZmFjZXNfMS5EaXJlY3Rpb24uTGVmdFxyXG4gICAgICAgICAgICAgICAgICAgIDogaW50ZXJmYWNlc18xLkRpcmVjdGlvbi5SaWdodDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgJ0Fycm93RG93bic6IHtcclxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbiA9IGxhc3RBcGxsaWVkRGlyZWN0aW9uICE9PSBudWxsXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgbGFzdEFwbGxpZWREaXJlY3Rpb24gPT09IGludGVyZmFjZXNfMS5EaXJlY3Rpb24uVXBcclxuICAgICAgICAgICAgICAgICAgICA/IGludGVyZmFjZXNfMS5EaXJlY3Rpb24uVXBcclxuICAgICAgICAgICAgICAgICAgICA6IGludGVyZmFjZXNfMS5EaXJlY3Rpb24uRG93bjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghaXNHYW1lU3RhcnRlZCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc3RhcnRpbmcgZ2FtZS4uLicpO1xyXG4gICAgICAgICAgICBsb29wKCk7XHJcbiAgICAgICAgICAgIGlzR2FtZVN0YXJ0ZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59O1xyXG5jb25zdCBzdGFydCA9ICgpID0+IHtcclxuICAgIHNldEV2ZW50cygpO1xyXG59O1xyXG5leHBvcnRzLnN0YXJ0ID0gc3RhcnQ7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuQ2FudmFzRWxlbWVudCA9IHZvaWQgMDtcclxuY29uc3Qgc2V0dGluZ3NfMSA9IHJlcXVpcmUoXCIuLi8uLi9jb25zdGFudHMvc2V0dGluZ3NcIik7XHJcbmNsYXNzIENhbnZhc0VsZW1lbnQge1xyXG4gICAgY29uc3RydWN0b3IoY29udGV4dCkge1xyXG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVGaWxsU3R5bGUoY29sb3IpIHtcclxuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gY29sb3I7XHJcbiAgICB9XHJcbiAgICBkcmF3Q2VsbChjb29yZHMpIHtcclxuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFJlY3Qoc2V0dGluZ3NfMS5zZXR0aW5ncy5HQVAgKyBjb29yZHMueCwgc2V0dGluZ3NfMS5zZXR0aW5ncy5HQVAgKyBjb29yZHMueSwgc2V0dGluZ3NfMS5zZXR0aW5ncy5SRUNUX0NFTExfU0laRSwgc2V0dGluZ3NfMS5zZXR0aW5ncy5SRUNUX0NFTExfU0laRSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5DYW52YXNFbGVtZW50ID0gQ2FudmFzRWxlbWVudDtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5GaWVsZCA9IHZvaWQgMDtcclxuY29uc3Qgc2V0dGluZ3NfMSA9IHJlcXVpcmUoXCIuLi8uLi9jb25zdGFudHMvc2V0dGluZ3NcIik7XHJcbmNvbnN0IGNhbnZhc0VsZW1lbnRfMSA9IHJlcXVpcmUoXCIuL2NhbnZhc0VsZW1lbnRcIik7XHJcbmNvbnN0IGZydWl0TGlzdF8xID0gcmVxdWlyZShcIi4vZnJ1aXRMaXN0XCIpO1xyXG5sZXQgbW9ja0ZydWl0c1N0YWNrID0gW1xyXG4gICAgeyB4OiBzZXR0aW5nc18xLnNldHRpbmdzLkNFTExfU0laRSAqIDUsIHk6IHNldHRpbmdzXzEuc2V0dGluZ3MuQ0VMTF9TSVpFIH0sXHJcbiAgICB7IHg6IHNldHRpbmdzXzEuc2V0dGluZ3MuQ0VMTF9TSVpFLCB5OiBzZXR0aW5nc18xLnNldHRpbmdzLkNFTExfU0laRSAqIDIgfSxcclxuICAgIHsgeDogc2V0dGluZ3NfMS5zZXR0aW5ncy5DRUxMX1NJWkUsIHk6IHNldHRpbmdzXzEuc2V0dGluZ3MuQ0VMTF9TSVpFIH0sXHJcbiAgICB7IHg6IHNldHRpbmdzXzEuc2V0dGluZ3MuQ0VMTF9TSVpFICogNiwgeTogc2V0dGluZ3NfMS5zZXR0aW5ncy5DRUxMX1NJWkUgKiA3IH0sXHJcbiAgICB7IHg6IHNldHRpbmdzXzEuc2V0dGluZ3MuQ0VMTF9TSVpFICogMywgeTogc2V0dGluZ3NfMS5zZXR0aW5ncy5DRUxMX1NJWkUgKiAzIH0sXHJcbiAgICB7IHg6IHNldHRpbmdzXzEuc2V0dGluZ3MuQ0VMTF9TSVpFICogOCwgeTogc2V0dGluZ3NfMS5zZXR0aW5ncy5DRUxMX1NJWkUgKiAyIH0sXHJcbiAgICB7IHg6IDAsIHk6IDAgfVxyXG5dO1xyXG4vLyBiYWNrZ3JvdW5kIGFuZCBmcnVpdHMgbWFuYWdlbWVudFxyXG5jbGFzcyBGaWVsZCBleHRlbmRzIGNhbnZhc0VsZW1lbnRfMS5DYW52YXNFbGVtZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbnRleHQpIHtcclxuICAgICAgICBzdXBlcihjb250ZXh0KTtcclxuICAgICAgICB0aGlzLmZydWl0TGlzdCA9IG5ldyBmcnVpdExpc3RfMS5GcnVpdExpc3QoY29udGV4dCk7XHJcbiAgICAgICAgdGhpcy5vY2N1cGllZFNsb3RzID0gW3NldHRpbmdzXzEuc2V0dGluZ3MuSU5JVElBTF9TTkFLRV9QT1NJVElPTl07XHJcbiAgICAgICAgdGhpcy5fc3Bhd25GcnVpdHMoc2V0dGluZ3NfMS5zZXR0aW5ncy5GUlVJVFNfUVRZX0FUX01PTUVOVCk7XHJcbiAgICB9XHJcbiAgICBkcmF3KCkge1xyXG4gICAgICAgIHRoaXMuX2RyYXdCYWNrUGFydCgpO1xyXG4gICAgICAgIHRoaXMuX2RyYXdGcm9udFBhcnQoKTtcclxuICAgICAgICB0aGlzLmZydWl0TGlzdC5kcmF3KCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFVwZGF0ZXMgaW5uZXIgb2N1cHBpZWQgYXJyYXkgYW5kIG5vdGlmaWVzIGFib3V0IGNvbGxhcHNlXHJcbiAgICAgKiBAcGFyYW0gc2xvdHMgU25ha2UncyBzbG90cyBvbiBmaWVsZFxyXG4gICAgICogQHJldHVybnMgQ29sbGFwc2UgZmxhZyA6OiBpZiBzbmFrZSBhdGUgZnJ1aXQgaXQgcmV0dXJucyB0cnVlOyBvdGhlcndpc2UgZmFsc2VcclxuICAgICAqL1xyXG4gICAgdXBkYXRlT2NjdXBpZWRTbG90cyhzbG90cykge1xyXG4gICAgICAgIHRoaXMub2NjdXBpZWRTbG90cy5zcGxpY2UoMCwgdGhpcy5vY2N1cGllZFNsb3RzLmxlbmd0aCAtIDEsIC4uLnNsb3RzKTtcclxuICAgICAgICBjb25zdCBpc0ZydWl0RWF0ZW4gPSB0aGlzLmZydWl0TGlzdC5oYXMoc2xvdHNbMF0pO1xyXG4gICAgICAgIGlmIChpc0ZydWl0RWF0ZW4pIHtcclxuICAgICAgICAgICAgdGhpcy5mcnVpdExpc3QucmVtb3ZlKHNsb3RzWzBdKTtcclxuICAgICAgICAgICAgdGhpcy5fc3Bhd25GcnVpdHMoMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpc0ZydWl0RWF0ZW47XHJcbiAgICB9XHJcbiAgICAvLyBiYWNrZ3JvdW5kXHJcbiAgICBfZHJhd0JhY2tQYXJ0KCkge1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZUZpbGxTdHlsZShzZXR0aW5nc18xLnNldHRpbmdzLkJBQ0tHUk9VTkRfQ09MT1IpO1xyXG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsUmVjdCgwLCAwLCBzZXR0aW5nc18xLnNldHRpbmdzLkNBTlZBU19TSVpFLCBzZXR0aW5nc18xLnNldHRpbmdzLkNBTlZBU19TSVpFKTtcclxuICAgIH1cclxuICAgIC8vIGNlbGxzXHJcbiAgICBfZHJhd0Zyb250UGFydCgpIHtcclxuICAgICAgICBzdXBlci51cGRhdGVGaWxsU3R5bGUoc2V0dGluZ3NfMS5zZXR0aW5ncy5CQUNLR1JPVU5EX0NFTExfQ09MT1IpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2V0dGluZ3NfMS5zZXR0aW5ncy5ESU1FTlNJT047IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNldHRpbmdzXzEuc2V0dGluZ3MuRElNRU5TSU9OOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHN1cGVyLmRyYXdDZWxsKHtcclxuICAgICAgICAgICAgICAgICAgICB4OiBzZXR0aW5nc18xLnNldHRpbmdzLkNFTExfU0laRSAqIGksXHJcbiAgICAgICAgICAgICAgICAgICAgeTogc2V0dGluZ3NfMS5zZXR0aW5ncy5DRUxMX1NJWkUgKiBqXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIF9nZXRGcmVlU2xvdHMoKSB7XHJcbiAgICAgICAgY29uc3QgZnJlZVNsb3RzID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZXR0aW5nc18xLnNldHRpbmdzLkRJTUVOU0lPTjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2V0dGluZ3NfMS5zZXR0aW5ncy5ESU1FTlNJT047IGorKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY3VyclNsb3RDb29yZHMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgeDogc2V0dGluZ3NfMS5zZXR0aW5ncy5DRUxMX1NJWkUgKiBpLFxyXG4gICAgICAgICAgICAgICAgICAgIHk6IHNldHRpbmdzXzEuc2V0dGluZ3MuQ0VMTF9TSVpFICogalxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlzQ3VyclNsb3RPY2N1cGllZCA9IHRoaXMub2NjdXBpZWRTbG90cy5zb21lKHNsb3RDb29yZHMgPT4gc2xvdENvb3Jkcy54ID09PSBjdXJyU2xvdENvb3Jkcy54XHJcbiAgICAgICAgICAgICAgICAgICAgJiYgc2xvdENvb3Jkcy55ID09PSBjdXJyU2xvdENvb3Jkcy55KTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlzQ3VyclNsb3RGcnVpdCA9IHRoaXMuZnJ1aXRMaXN0LmhhcyhjdXJyU2xvdENvb3Jkcyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWlzQ3VyclNsb3RPY2N1cGllZCAmJiAhaXNDdXJyU2xvdEZydWl0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnJlZVNsb3RzLnB1c2goY3VyclNsb3RDb29yZHMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmcmVlU2xvdHM7XHJcbiAgICB9XHJcbiAgICBfc3Bhd25GcnVpdHMoZnJ1aXRzUXR5KSB7XHJcbiAgICAgICAgY29uc3QgZnJlZVNsb3RzID0gdGhpcy5fZ2V0RnJlZVNsb3RzKCk7XHJcbiAgICAgICAgY29uc3QgcmFuZG9taXplID0gKG1pbiwgbWF4KSA9PiBNYXRoLnJvdW5kKChNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikpICsgbWluKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZydWl0c1F0eTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChtb2NrRnJ1aXRzU3RhY2subGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBjb25zdCBpZHggPSByYW5kb21pemUoMCwgZnJlZVNsb3RzLmxlbmd0aCAtIDEpO1xyXG4gICAgICAgICAgICB0aGlzLmZydWl0TGlzdC5hZGQoZnJlZVNsb3RzW2lkeF0pO1xyXG4gICAgICAgICAgICBmcmVlU2xvdHMuc3BsaWNlKGlkeCwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuRmllbGQgPSBGaWVsZDtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5GcnVpdEl0ZW0gPSB2b2lkIDA7XHJcbmNvbnN0IHNldHRpbmdzXzEgPSByZXF1aXJlKFwiLi4vLi4vY29uc3RhbnRzL3NldHRpbmdzXCIpO1xyXG5jb25zdCBjYW52YXNFbGVtZW50XzEgPSByZXF1aXJlKFwiLi9jYW52YXNFbGVtZW50XCIpO1xyXG5jbGFzcyBGcnVpdEl0ZW0gZXh0ZW5kcyBjYW52YXNFbGVtZW50XzEuQ2FudmFzRWxlbWVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb250ZXh0LCBwb3NpdGlvbikge1xyXG4gICAgICAgIHN1cGVyKGNvbnRleHQpO1xyXG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uID0gcG9zaXRpb247XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIERyYXdzIGZydWl0XHJcbiAgICAgKi9cclxuICAgIGRyYXcoKSB7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlRmlsbFN0eWxlKHNldHRpbmdzXzEuc2V0dGluZ3MuRlJVSVRfQ09MT1IpO1xyXG4gICAgICAgIHRoaXMuZHJhd0NlbGwodGhpcy5fcG9zaXRpb24pO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGZydWl0IGNvb3Jkc1xyXG4gICAgICogQHJldHVybnNcclxuICAgICAqL1xyXG4gICAgZ2V0Q29vcmRzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wb3NpdGlvbjtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLkZydWl0SXRlbSA9IEZydWl0SXRlbTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5GcnVpdExpc3QgPSB2b2lkIDA7XHJcbmNvbnN0IGNhbnZhc0VsZW1lbnRfMSA9IHJlcXVpcmUoXCIuL2NhbnZhc0VsZW1lbnRcIik7XHJcbmNvbnN0IGZydWl0SXRlbV8xID0gcmVxdWlyZShcIi4vZnJ1aXRJdGVtXCIpO1xyXG5jbGFzcyBGcnVpdExpc3QgZXh0ZW5kcyBjYW52YXNFbGVtZW50XzEuQ2FudmFzRWxlbWVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb250ZXh0KSB7XHJcbiAgICAgICAgc3VwZXIoY29udGV4dCk7XHJcbiAgICAgICAgdGhpcy5mcnVpdExpc3QgPSBbXTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogRHJhd3MgZnJ1aXRzXHJcbiAgICAgKi9cclxuICAgIGRyYXcoKSB7XHJcbiAgICAgICAgdGhpcy5mcnVpdExpc3QuZm9yRWFjaChmcnVpdCA9PiBmcnVpdC5kcmF3KCkpO1xyXG4gICAgfVxyXG4gICAgZ2V0TGVuZ3RoKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZydWl0TGlzdC5sZW5ndGg7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIENoZWNrcyBmb3IgZnJ1aXQgZXhpc3RhbmNlIGJ5IGNvb3Jkc1xyXG4gICAgICogQHBhcmFtIHtJQ29vcmRzfSBmcnVpdENvb3JkcyBGcnVpdCBjb29yZHNcclxuICAgICAqIEByZXR1cm5zIGlzRXhpc3QgZmxhZ1xyXG4gICAgICovXHJcbiAgICBoYXMoZnJ1aXRDb29yZHMpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5mcnVpdExpc3Quc29tZShmcnVpdCA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJGcnVpdENvb3JkcyA9IGZydWl0LmdldENvb3JkcygpO1xyXG4gICAgICAgICAgICByZXR1cm4gY3VyckZydWl0Q29vcmRzLnggPT09IGZydWl0Q29vcmRzLnhcclxuICAgICAgICAgICAgICAgICYmIGN1cnJGcnVpdENvb3Jkcy55ID09PSBmcnVpdENvb3Jkcy55O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIGZydWl0IGJ5IGNvb3Jkc1xyXG4gICAgICogQHBhcmFtIHtJQ29vcmRzfSBmcnVpdENvb3JkcyBGcnVpdCBDb29yZHNcclxuICAgICAqL1xyXG4gICAgYWRkKGZydWl0Q29vcmRzKSB7XHJcbiAgICAgICAgY29uc3QgZnJ1aXQgPSBuZXcgZnJ1aXRJdGVtXzEuRnJ1aXRJdGVtKHRoaXMuY29udGV4dCwgZnJ1aXRDb29yZHMpO1xyXG4gICAgICAgIHRoaXMuZnJ1aXRMaXN0LnB1c2goZnJ1aXQpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIGZydWl0IGZvciBsaXN0IGJ5IGNvb3Jkc1xyXG4gICAgICogQHBhcmFtIHtJQ29vcmRzfSBmcnVpdENvb3JkcyBGcnVpdCBjb29yZHNcclxuICAgICAqL1xyXG4gICAgcmVtb3ZlKGZydWl0Q29vcmRzKSB7XHJcbiAgICAgICAgY29uc3QgcmVtb3ZlSWR4ID0gdGhpcy5mcnVpdExpc3QuZmluZEluZGV4KGZydWl0ID0+IHtcclxuICAgICAgICAgICAgY29uc3QgY3VyckZydWl0Q29vcmRzID0gZnJ1aXQuZ2V0Q29vcmRzKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBjdXJyRnJ1aXRDb29yZHMueCA9PT0gZnJ1aXRDb29yZHMueFxyXG4gICAgICAgICAgICAgICAgJiYgY3VyckZydWl0Q29vcmRzLnkgPT09IGZydWl0Q29vcmRzLnk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5mcnVpdExpc3Quc3BsaWNlKHJlbW92ZUlkeCwgMSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5GcnVpdExpc3QgPSBGcnVpdExpc3Q7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuU25ha2UgPSB2b2lkIDA7XHJcbmNvbnN0IHNldHRpbmdzXzEgPSByZXF1aXJlKFwiLi4vLi4vY29uc3RhbnRzL3NldHRpbmdzXCIpO1xyXG5jb25zdCBpbnRlcmZhY2VzXzEgPSByZXF1aXJlKFwiLi4vLi4vaW50ZXJmYWNlc1wiKTtcclxuY29uc3QgY2FudmFzRWxlbWVudF8xID0gcmVxdWlyZShcIi4vY2FudmFzRWxlbWVudFwiKTtcclxuY2xhc3MgU25ha2UgZXh0ZW5kcyBjYW52YXNFbGVtZW50XzEuQ2FudmFzRWxlbWVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb250ZXh0KSB7XHJcbiAgICAgICAgc3VwZXIoY29udGV4dCk7XHJcbiAgICAgICAgdGhpcy5fc3RvbWFjaCA9IFtdO1xyXG4gICAgICAgIHRoaXMuX3RhaWwgPSBbXTtcclxuICAgICAgICBzdXBlci51cGRhdGVGaWxsU3R5bGUoc2V0dGluZ3NfMS5zZXR0aW5ncy5TTkFLRV9DT0xPUik7XHJcbiAgICAgICAgdGhpcy5oZWFkUG9zaXRpb24gPSBzZXR0aW5nc18xLnNldHRpbmdzLklOSVRJQUxfU05BS0VfUE9TSVRJT047XHJcbiAgICB9XHJcbiAgICBkcmF3KCkge1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZUZpbGxTdHlsZShzZXR0aW5nc18xLnNldHRpbmdzLlNOQUtFX0NPTE9SKTtcclxuICAgICAgICB0aGlzLmRyYXdDZWxsKHRoaXMuaGVhZFBvc2l0aW9uKTtcclxuICAgICAgICB0aGlzLl90YWlsLmZvckVhY2godGhpcy5kcmF3Q2VsbC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuICAgIGNyYXdsKHBvc2l0aW9uLCBoYXNGcnVpdCkge1xyXG4gICAgICAgIHRoaXMuX3RhaWwudW5zaGlmdCh0aGlzLmhlYWRQb3NpdGlvbik7XHJcbiAgICAgICAgbGV0IHJlbW92ZUlkeCA9IC0xO1xyXG4gICAgICAgIGNvbnN0IGRpZ2VzdGVkRnJ1aXRDb29yZHMgPSB0aGlzLl9zdG9tYWNoLmZpbmQoKGZydWl0UG9zaXRpb24sIGlkeCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5fdGFpbC5sZW5ndGggPyB0aGlzLl90YWlsLmF0KC0xKS54IDogdGhpcy5oZWFkUG9zaXRpb24ueDtcclxuICAgICAgICAgICAgY29uc3QgeSA9IHRoaXMuX3RhaWwubGVuZ3RoID8gdGhpcy5fdGFpbC5hdCgtMSkueSA6IHRoaXMuaGVhZFBvc2l0aW9uLnk7XHJcbiAgICAgICAgICAgIGNvbnN0IGlzRGlnZXN0ZWQgPSBmcnVpdFBvc2l0aW9uLnggPT09IHggJiYgZnJ1aXRQb3NpdGlvbi55ID09PSB5O1xyXG4gICAgICAgICAgICBpZiAoaXNEaWdlc3RlZClcclxuICAgICAgICAgICAgICAgIHJlbW92ZUlkeCA9IGlkeDtcclxuICAgICAgICAgICAgcmV0dXJuIGlzRGlnZXN0ZWQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKGRpZ2VzdGVkRnJ1aXRDb29yZHMpXHJcbiAgICAgICAgICAgIHRoaXMuX3N0b21hY2guc3BsaWNlKHJlbW92ZUlkeCwgMSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLl90YWlsLnBvcCgpO1xyXG4gICAgICAgIHRoaXMuaGVhZFBvc2l0aW9uID0gcG9zaXRpb247XHJcbiAgICAgICAgaWYgKGhhc0ZydWl0KVxyXG4gICAgICAgICAgICB0aGlzLl9zdG9tYWNoLnB1c2gocG9zaXRpb24pO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGVzIG5leHQgc25ha2Ugc2xvdHMgb3Igbm90aWZpZXMgYWJvdXQgY3Jhc2hcclxuICAgICAqIEBwYXJhbSBkaXJlY3Rpb24gc25ha2UncyBkaXJlY3Rpb24gOjogdXAsIGRvd24sIGxlZnQsIHJpZ2h0XHJcbiAgICAgKiBAcmV0dXJucyBmYWxzZSBpZiBzbmFrZSBhdGUgaXRzZWxmOyBvdGhlcndpc2UgbmV4dCBzbmFrZSBzbG90c1xyXG4gICAgICovXHJcbiAgICBnZXROZXh0U25ha2VTbG90cyhkaXJlY3Rpb24pIHtcclxuICAgICAgICBsZXQgaGVhZFBvc2l0aW9uO1xyXG4gICAgICAgIHN3aXRjaCAoZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGNhc2UgaW50ZXJmYWNlc18xLkRpcmVjdGlvbi5VcDoge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcG90ZW50aWFsUG9zaXRpb25ZID0gdGhpcy5oZWFkUG9zaXRpb24ueSAtIHNldHRpbmdzXzEuc2V0dGluZ3MuQ0VMTF9TSVpFO1xyXG4gICAgICAgICAgICAgICAgaGVhZFBvc2l0aW9uID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHg6IHRoaXMuaGVhZFBvc2l0aW9uLngsXHJcbiAgICAgICAgICAgICAgICAgICAgeTogcG90ZW50aWFsUG9zaXRpb25ZIDwgMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA/IHNldHRpbmdzXzEuc2V0dGluZ3MuQ0FOVkFTX1NJWkUgLSBzZXR0aW5nc18xLnNldHRpbmdzLkNFTExfU0laRVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IHBvdGVudGlhbFBvc2l0aW9uWVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgaW50ZXJmYWNlc18xLkRpcmVjdGlvbi5Eb3duOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwb3RlbnRpYWxQb3NpdGlvblkgPSB0aGlzLmhlYWRQb3NpdGlvbi55ICsgc2V0dGluZ3NfMS5zZXR0aW5ncy5DRUxMX1NJWkU7XHJcbiAgICAgICAgICAgICAgICBoZWFkUG9zaXRpb24gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgeDogdGhpcy5oZWFkUG9zaXRpb24ueCxcclxuICAgICAgICAgICAgICAgICAgICB5OiBwb3RlbnRpYWxQb3NpdGlvblkgKyBzZXR0aW5nc18xLnNldHRpbmdzLkNFTExfU0laRSA+IHNldHRpbmdzXzEuc2V0dGluZ3MuQ0FOVkFTX1NJWkVcclxuICAgICAgICAgICAgICAgICAgICAgICAgPyAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogcG90ZW50aWFsUG9zaXRpb25ZXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBpbnRlcmZhY2VzXzEuRGlyZWN0aW9uLkxlZnQ6IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBvdGVudGlhbFBvc2l0aW9uWCA9IHRoaXMuaGVhZFBvc2l0aW9uLnggLSBzZXR0aW5nc18xLnNldHRpbmdzLkNFTExfU0laRTtcclxuICAgICAgICAgICAgICAgIGhlYWRQb3NpdGlvbiA9IHtcclxuICAgICAgICAgICAgICAgICAgICB4OiBwb3RlbnRpYWxQb3NpdGlvblggPCAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gc2V0dGluZ3NfMS5zZXR0aW5ncy5DQU5WQVNfU0laRSAtIHNldHRpbmdzXzEuc2V0dGluZ3MuQ0VMTF9TSVpFXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogcG90ZW50aWFsUG9zaXRpb25YLFxyXG4gICAgICAgICAgICAgICAgICAgIHk6IHRoaXMuaGVhZFBvc2l0aW9uLnlcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIGludGVyZmFjZXNfMS5EaXJlY3Rpb24uUmlnaHQ6IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBvdGVudGlhbFBvc2l0aW9uWCA9IHRoaXMuaGVhZFBvc2l0aW9uLnggKyBzZXR0aW5nc18xLnNldHRpbmdzLkNFTExfU0laRTtcclxuICAgICAgICAgICAgICAgIGhlYWRQb3NpdGlvbiA9IHtcclxuICAgICAgICAgICAgICAgICAgICB4OiBwb3RlbnRpYWxQb3NpdGlvblggKyBzZXR0aW5nc18xLnNldHRpbmdzLkNFTExfU0laRSA+IHNldHRpbmdzXzEuc2V0dGluZ3MuQ0FOVkFTX1NJWkVcclxuICAgICAgICAgICAgICAgICAgICAgICAgPyAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogcG90ZW50aWFsUG9zaXRpb25YLFxyXG4gICAgICAgICAgICAgICAgICAgIHk6IHRoaXMuaGVhZFBvc2l0aW9uLnlcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBhdGUgaXRzZWxmXHJcbiAgICAgICAgaWYgKHRoaXMuX3RhaWwuc29tZShwID0+IHAueCA9PT0gaGVhZFBvc2l0aW9uLnhcclxuICAgICAgICAgICAgJiYgcC55ID09PSBoZWFkUG9zaXRpb24ueSkpXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAvLyBuZXh0IHNuYWtlIHNsb3RzXHJcbiAgICAgICAgcmV0dXJuIFtoZWFkUG9zaXRpb24sIHRoaXMuaGVhZFBvc2l0aW9uLCAuLi50aGlzLl90YWlsLnNsaWNlKDAsIC0xKV07XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5TbmFrZSA9IFNuYWtlO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmZyYW1lID0gdm9pZCAwO1xyXG5jb25zdCBzZXR0aW5nc18xID0gcmVxdWlyZShcIi4uL2NvbnN0YW50cy9zZXR0aW5nc1wiKTtcclxuZnVuY3Rpb24gZnJhbWUoY29udGV4dCwgc25ha2UsIGZpZWxkLCBkaXJlY3Rpb24pIHtcclxuICAgIGNvbnN0IHNuYWtlU2xvdHMgPSBzbmFrZS5nZXROZXh0U25ha2VTbG90cyhkaXJlY3Rpb24pO1xyXG4gICAgaWYgKCFzbmFrZVNsb3RzKVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIGNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHNldHRpbmdzXzEuc2V0dGluZ3MuQ0FOVkFTX1NJWkUsIHNldHRpbmdzXzEuc2V0dGluZ3MuQ0FOVkFTX1NJWkUpO1xyXG4gICAgY29uc3QgaXNGcnVpdEVhdGVuID0gZmllbGQudXBkYXRlT2NjdXBpZWRTbG90cyhzbmFrZVNsb3RzKTtcclxuICAgIGZpZWxkLmRyYXcoKTtcclxuICAgIHNuYWtlLmNyYXdsKHNuYWtlU2xvdHNbMF0sIGlzRnJ1aXRFYXRlbik7XHJcbiAgICBzbmFrZS5kcmF3KCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufVxyXG5leHBvcnRzLmZyYW1lID0gZnJhbWU7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuRGlyZWN0aW9uID0gdm9pZCAwO1xyXG52YXIgRGlyZWN0aW9uO1xyXG4oZnVuY3Rpb24gKERpcmVjdGlvbikge1xyXG4gICAgRGlyZWN0aW9uW0RpcmVjdGlvbltcIlVwXCJdID0gMF0gPSBcIlVwXCI7XHJcbiAgICBEaXJlY3Rpb25bRGlyZWN0aW9uW1wiRG93blwiXSA9IDFdID0gXCJEb3duXCI7XHJcbiAgICBEaXJlY3Rpb25bRGlyZWN0aW9uW1wiTGVmdFwiXSA9IDJdID0gXCJMZWZ0XCI7XHJcbiAgICBEaXJlY3Rpb25bRGlyZWN0aW9uW1wiUmlnaHRcIl0gPSAzXSA9IFwiUmlnaHRcIjtcclxufSkoRGlyZWN0aW9uID0gZXhwb3J0cy5EaXJlY3Rpb24gfHwgKGV4cG9ydHMuRGlyZWN0aW9uID0ge30pKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgYm9vdHN0cmFwXzEgPSByZXF1aXJlKFwiLi9nYW1lL2Jvb3RzdHJhcFwiKTtcclxucmVxdWlyZShcIi4vc3R5bGVzL2luZGV4LnNjc3NcIik7XHJcbigwLCBib290c3RyYXBfMS5zdGFydCkoKTtcclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL21haW4udHNcIik7XG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvc3R5bGVzL2luZGV4LnNjc3NcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=