/**
 * Created by jadoux on 04/11/2016.
 */
var canvas = new fabric.Canvas('c', { selection: false });

var grid = 50;

for (var i = 0; i <= (canvas.width / grid); i++) {
    canvas.add(new fabric.Line([ i * grid, 0, i * grid, canvas.height], { stroke: '#ccc', selectable: false }));
    canvas.add(new fabric.Line([ 0, i * grid, canvas.width, i * grid], { stroke: '#ccc', selectable: false }));
}

var modeZoneObj = {
    width: 50,
    height: 50,
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

var squareList = {};

var circle = new fabric.Circle({
    left: 0,
    top: 0,
    radius: grid / 2,
    fill: '#9f9',
    originX: 'left',
    originY: 'top',
    hasRotatingPoint: false
});
/*
circle.customiseCornerIcons({
    settings: {
        borderColor: 'black',
        cornerSize: 25,
        cornerShape: 'rect',
        cornerPadding: 10
    },
    tl: {
        icon: 'img/move.png'
    },
    tr: {
        icon: 'img/move.png'
    },
    bl: {
        icon: 'img/move.png'
    },
    br: {
        icon: 'img/move.png'
    }
});
*/

fabric.Canvas.prototype.customiseControls({
    tl: {
        action: function( e, target ) {
            setMovingElement(target);
            target.set( {
                left: target.left - grid,
                top: target.top - grid
            } );
            canvas.renderAll();
        }
    },
    tr: {
        action: function( e, target ) {
            setMovingElement(target);
            target.set( {
                left: target.left + grid,
                top: target.top - grid
            } );
            canvas.renderAll();
        }
    },
    bl: {
        action: function( e, target ) {
            setMovingElement(target);
            target.set( {
                left: target.left - grid,
                top: target.top + grid
            } );
            canvas.renderAll();
        }
    },
    br: {
        action: function( e, target ) {
            setMovingElement(target);
            target.set( {
                left: target.left + grid,
                top: target.top + grid
            } );
            canvas.renderAll();
        }
    }
});

// add objects
fabric.Image.fromURL('/boardFabricJs/img/move.png', function(img) {
    var img1 = img.scale(1).set({ left: 0, top: 0 });

    fabric.Image.fromURL('/boardFabricJs/img/move.png', function(img) {
        var img2 = img.scale(1).set({ left: 25, top: 25 });

        fabric.Image.fromURL('/boardFabricJs/img/move.png', function(img) {
            var img3 = img.scale(1).set({ left: 50, top: 50 });

            canvas.add(new fabric.Group([ img1, img2, img3], { left: 100, top: 100, width: 50, height: 50}))
        });
    });
});
/*fabric.Image.fromURL('/boardFabricJs/img/move.png', function(img) {
    var img1 = img.set({left: 0, top: 0 });
    var img2 = img.set({left: 50, top: 50 });


    var group1 = new fabric.Group([circle, img1, img2], {left: 300, top: 300, hasControls: false});
    canvas.add(group1);
});*/

canvas.on('object:moving', function(options) {
    options.target.set({
        left: Math.round(options.target.left / grid) * grid,
        top: Math.round(options.target.top / grid) * grid
    });
    setMovingElement(options.target);
});

canvas.on('mouse:up', function (e) {
    var pointer = canvas.getPointer(e.e);
    var posx = pointer.x;
    var posy = pointer.y;
    //check if user clicked an object
    if (e.target && e.target.isWalkingWay) {
        squareList[e.target.left + " " + e.target.top] = false;
        e.target.remove();
    }
});

function setMovingElement(object) {
    if(typeof squareList[object.left + " " +object.top] == "undefined" || !squareList[object.left + " " +object.top]) {
        modeZoneObj.left = object.left;
        modeZoneObj.top = object.top;
        var rect = new fabric.Rect(modeZoneObj);
        squareList[object.left + " " + object.top] = new fabric.Rect(modeZoneObj);
        canvas.add(rect);
        canvas.moveTo(rect, -10);
    }
}

$(function(){

    $('#canvasContainer').bind('mousewheel DOMMouseScroll', function(event){
        if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
            // scroll up
            canvas.setZoom(canvas.getZoom() * 1.1 ) ;
        }
        else {
            // scroll down
            canvas.setZoom(canvas.getZoom() / 1.1 ) ;
        }
    }).mousedown(startPan);

    $('#gotoCircle').click(function(){
        var zoom = 1;
        canvas.setZoom(1);  // reset zoom so pan actions work as expected
        vpw = canvas.width / zoom;
        vph = canvas.height / zoom;
        x = (circle.left);  // x is the location where the top left of the viewport should be
        y = (circle.top);  // y idem
        canvas.absolutePan({x:x, y:y});
        canvas.setZoom(zoom);
    });

    $('#reinitZoom').click(function(){
        canvas.setZoom( 1 ) ;
    }) ;

    $('#zoomIn').click(function(){
        canvas.setZoom(canvas.getZoom() * 1.1 ) ;
    }) ;

    $('#zoomOut').click(function(){
        canvas.setZoom(canvas.getZoom() / 1.1 ) ;
    }) ;

    $('#goRight').click(function(){
        var units = 10 ;
        var delta = new fabric.Point(units,0) ;
        canvas.relativePan(delta) ;
    }) ;

    $('#goLeft').click(function(){
        var units = 10 ;
        var delta = new fabric.Point(-units,0) ;
        canvas.relativePan(delta) ;
    }) ;
    $('#goUp').click(function(){
        var units = 10 ;
        var delta = new fabric.Point(0,-units) ;
        canvas.relativePan(delta) ;
    }) ;

    $('#goDown').click(function(){
        var units = 10 ;
        var delta = new fabric.Point(0,units) ;
        canvas.relativePan(delta) ;
    }) ;

    $(document).keydown(function(e) {
        switch(e.which) {
            case 37: // left
                if(canvas.getActiveObject()) {
                    setMovingElement(canvas.getActiveObject());
                    canvas.getActiveObject().set({
                        left: canvas.getActiveObject().left - grid
                    });
                    canvas.renderAll();
                }
                break;

            case 38: // up
                if(canvas.getActiveObject()) {
                    setMovingElement(canvas.getActiveObject());
                    canvas.getActiveObject().set({
                        top: canvas.getActiveObject().top - grid
                    });
                    canvas.renderAll();
                }
                break;

            case 39: // right
                if(canvas.getActiveObject()) {
                    setMovingElement(canvas.getActiveObject());
                    canvas.getActiveObject().set({
                        left: canvas.getActiveObject().left + grid
                    });
                    canvas.renderAll();
                }
                break;

            case 40: // down
                if(canvas.getActiveObject()) {
                    setMovingElement(canvas.getActiveObject());
                    canvas.getActiveObject().set({
                        top: canvas.getActiveObject().top + grid
                    });
                    canvas.renderAll();
                }
                break;

            default: return; // exit this handler for other keys
        }

        canvas.setZoom(canvas.getZoom());
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });

    $('#canvasContainer').contextmenu(cancelMenu);

    function startPan(event) {
        if (event.button != 2) {
            return;
        }
        if(canvas.getActiveObject()) {
            return;
        }
        var x0 = event.screenX,
            y0 = event.screenY;
        function continuePan(event) {
            var x = event.screenX,
                y = event.screenY;
            canvas.relativePan({ x: x - x0, y: y - y0 });
            x0 = x;
            y0 = y;
        }
        function stopPan(event) {
            $(window).off('mousemove', continuePan);
            $(window).off('mouseup', stopPan);
        }
        $(window).mousemove(continuePan);
        $(window).mouseup(stopPan);
    }
    function cancelMenu() {
        return false;
    }
}) ;