/**
 * Created by jadoux on 08/11/2016.
 */
class GridBoard {
    constructor(fabricCanvas, $containerCanvas) {
        this.canvas = fabricCanvas;
        this.containerCanvas = $containerCanvas;
        this.grid = 50;
        this.generateGrid();
        this.initializeEvent();

        this.currentWalkingWay = {};
        this.keyMoveBinding = {
            up:38,
            down: 40,
            right: 39,
            left: 37,
            ur: 0,
            ul: 0,
            dr: 0,
            dl: 0
        };
        this.walkingObject = {
            width: this.grid,
            height: this.grid,
            left: 0,
            top: 0,
            originX: 'left',
            originY: 'top',
            hasControls: false,
            hasRotatingPoint: false,
            hasBorders: false,
            selectable: false,
            fill: '#B6EDBC',
            opacity: 0.7,
            isWalkingWay: true
        };

        this.elementLoaded = false;
    }

    initializeEvent() {
        this.containerCanvas.contextmenu(function() {return false;});

        this.containerCanvas.bind('mousewheel DOMMouseScroll', function(event){
            if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
                // scroll up
                this.canvas.setZoom(this.canvas.getZoom() * 1.1 ) ;
            }
            else {
                // scroll down
                this.canvas.setZoom(this.canvas.getZoom() / 1.1 ) ;
            }

            event.preventDefault();
        });

        this.containerCanvas.mousedown(function(event) {
            if (event.button != 2) {
                return;
            }

            var x0 = event.screenX,
                y0 = event.screenY;

            function continuePan(event) {
                var x = event.screenX,
                    y = event.screenY;
                this.canvas.relativePan({ x: x - x0, y: y - y0 });
                x0 = x;
                y0 = y;
            }
            function stopPan(event) {
                $(window).off('mousemove', continuePan);
                $(window).off('mouseup', stopPan);
            }
            $(window).mousemove(continuePan);
            $(window).mouseup(stopPan);
        });

        this.canvas.on('mouse:up', function (event) {
            if (event.target) {
                if(typeof event.target.clicked == 'function') {
                    event.target.clicked(event);
                }
            } else if(this.elementLoaded) {
                var pointer = this.canvas.getPointer(event.e);
                var posx = pointer.x;
                var posy = pointer.y;

                //Add element here
            }
        });

        this.canvas.on('object:moving', function(event) {
            event.target.set({
                left: Math.round(event.target.left / this.grid) * this.grid,
                top: Math.round(event.target.top / this.grid) * this.grid
            });
            this.setMovingElement(event.target);
        });

        $(document).keydown(function(e) {
            switch(e.which) {
                case this.keyMoveBinding.left: // left
                    if(this.canvas.getActiveObject()) {
                        this.setMovingElement(this.canvas.getActiveObject());
                        this.canvas.getActiveObject().set({
                            left: this.canvas.getActiveObject().left - this.grid
                        });
                        this.canvas.renderAll();
                    }
                    break;

                case this.keyMoveBinding.up: // up
                    if(this.canvas.getActiveObject()) {
                        this.setMovingElement(this.canvas.getActiveObject());
                        this.canvas.getActiveObject().set({
                            top: this.canvas.getActiveObject().top - this.grid
                        });
                        this.canvas.renderAll();
                    }
                    break;

                case this.keyMoveBinding.right: // right
                    if(this.canvas.getActiveObject()) {
                        this.setMovingElement(this.canvas.getActiveObject());
                        this.canvas.getActiveObject().set({
                            left: this.canvas.getActiveObject().left + this.grid
                        });
                        this.canvas.renderAll();
                    }
                    break;

                case this.keyMoveBinding.down: // down
                    if(this.canvas.getActiveObject()) {
                        this.setMovingElement(this.canvas.getActiveObject());
                        this.canvas.getActiveObject().set({
                            top: this.canvas.getActiveObject().top + this.grid
                        });
                        this.canvas.renderAll();
                    }
                    break;

                case this.keyMoveBinding.ur:
                    if(this.canvas.getActiveObject()) {
                        this.setMovingElement(this.canvas.getActiveObject());
                        this.canvas.getActiveObject().set({
                            top: this.canvas.getActiveObject().top - this.grid,
                            left: this.canvas.getActiveObject().left + this.grid
                        });
                        this.canvas.renderAll();
                    }
                    break;

                case this.keyMoveBinding.ul:
                    if(this.canvas.getActiveObject()) {
                        this.setMovingElement(this.canvas.getActiveObject());
                        this.canvas.getActiveObject().set({
                            top: this.canvas.getActiveObject().top - this.grid,
                            left: this.canvas.getActiveObject().left - this.grid
                        });
                        this.canvas.renderAll();
                    }
                    break;

                case this.keyMoveBinding.dr:
                    if(this.canvas.getActiveObject()) {
                        this.setMovingElement(this.canvas.getActiveObject());
                        this.canvas.getActiveObject().set({
                            top: this.canvas.getActiveObject().top + this.grid,
                            left: this.canvas.getActiveObject().left + this.grid
                        });
                        this.canvas.renderAll();
                    }
                    break;

                case this.keyMoveBinding.dl:
                    if(this.canvas.getActiveObject()) {
                        this.setMovingElement(this.canvas.getActiveObject());
                        this.canvas.getActiveObject().set({
                            top: this.canvas.getActiveObject().top + this.grid,
                            left: this.canvas.getActiveObject().left - this.grid
                        });
                        this.canvas.renderAll();
                    }
                    break;

                default: return; // exit this handler for other keys
            }

            this.canvas.setZoom(this.canvas.getZoom());
            e.preventDefault(); // prevent the default action (scroll / move caret)
        });
    }

    generateGrid() {
        for (var i = 0; i <= (this.canvas.width / this.grid); i++) {
            this.canvas.add(new fabric.Line([i * this.grid, 0, i * this.grid, this.canvas.height], {stroke: '#ccc', selectable: false}));
            this.canvas.add(new fabric.Line([0, i * this.grid, this.canvas.width, i * this.grid], {stroke: '#ccc', selectable: false}));
        }
    }

    gotoActiveObject() {
        if(this.canvas.getActiveObject()) {
            var zoom = 1;
            this.canvas.setZoom(1);  // reset zoom so pan actions work as expected
            vpw = this.canvas.width / zoom;
            vph = this.canvas.height / zoom;
            x = (this.canvas.getActiveObject().left);  // x is the location where the top left of the viewport should be
            y = (this.canvas.getActiveObject().top);  // y idem
            this.canvas.absolutePan({x:x, y:y});
            this.canvas.setZoom(zoom);
        }
    }

    setMovingElement(object) {
        if(typeof this.currentWalkingWay[object.left + " " + object.top] == "undefined" || !this.currentWalkingWay[object.left + " " + object.top]) {
            this.walkingObject.left = object.left;
            this.walkingObject.top = object.top;
            squareList[object.left + " " + object.top] = new fabric.Rect(this.walkingObject);
            canvas.add(squareList[object.left + " " + object.top]);
            canvas.moveTo(squareList[object.left + " " + object.top], -10);
        }
    }

    loadElementToAddIt(type, obj) {
        this.elementLoaded = {
            type: type,
            obj: obj
        }
    }

    removeElementLoaded() {
        this.elementLoaded = false;
    }

    addObjectMovable() {

    }
}
