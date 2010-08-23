/* -*- mode: javascript; c-basic-offset: 4; indent-tabs-mode: nil -*- */

// 
// Dalliance Genome Explorer
// (c) Thomas Down 2006-2010
//
// domui.js: SVG UI components
//

Browser.prototype.makeTooltip = function(ele, text)
{
    var thisB = this;
    var timer = null;
    var outlistener;
    outlistener = function(ev) {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        ele.removeEventListener('mouseout', outlistener, false);
    };

    ele.addEventListener('mouseover', function(ev) {
        var mx = ev.clientX + window.scrollX, my = ev.clientY + window.scrollY;
        if (!timer) {
            timer = setTimeout(function() {
                var popup = makeElement('div', text, {}, {
                    position: 'absolute',
                    top: '' + (my + 20) + 'px',
                    left: '' + Math.max(mx - 30, 20) + 'px',
                    backgroundColor: 'rgb(250, 240, 220)',
                    borderWidth: '1px',
                    borderColor: 'black',
                    borderStyle: 'solid',
                    padding: '2px',
                    maxWidth: '400px'
                });
                thisB.hPopupHolder.appendChild(popup);
                var moveHandler;
                moveHandler = function(ev) {
                    try {
                        thisB.hPopupHolder.removeChild(popup);
                    } catch (e) {
                        // May have been removed by other code which clears the popup layer.
                    }
                    window.removeEventListener('mousemove', moveHandler, false);
                }
                window.addEventListener('mousemove', moveHandler, false);
                timer = null;
            }, 1000);
            ele.addEventListener('mouseout', outlistener, false);
        }
    }, false);
}

Browser.prototype.popit = function(ev, name, ele, opts)
{
    if (!opts) {
        opts = {};
    }

    var mx =  ev.clientX, my = ev.clientY;
    mx +=  document.documentElement.scrollLeft || document.body.scrollLeft;
    my +=  document.documentElement.scrollTop || document.body.scrollTop;

    var popup = makeElement('div');
    var winWidth = window.innerWidth;
    popup.style.position = 'absolute';
    popup.style.top = '' + (my + 30) + 'px';
    popup.style.left = '' + Math.min((mx - 30), (winWidth-410)) + 'px';
    popup.style.width = '200px';
    popup.style.backgroundColor = 'white';
    popup.style.borderWidth = '1px';
    popup.style.borderColor = 'black'
    popup.style.borderStyle = 'solid';
    popup.style.padding = '2px';

    popup.appendChild(ele);

    this.hPopupHolder.appendChild(popup);
}

function IconSet(uri)
{
    var req = new XMLHttpRequest();
    req.open('get', uri, false);
    req.send();
    this.icons = req.responseXML;
}

IconSet.prototype.createIcon = function(name, parent)
{
    var master = this.icons.getElementById(name);
    if (!master) {
        alert("couldn't find " + name);
        return;
    }
    var copy = document.importNode(master, true);
    parent.appendChild(copy);
    var bbox = copy.getBBox();
    parent.removeChild(copy);
    copy.setAttribute('transform', 'translate(' + (-bbox.x)  + ',' + (-bbox.y)+ ')');
    var icon = makeElementNS(NS_SVG, 'g', copy);
    return icon;
}


IconSet.prototype.createButton = function(name, parent, bx, by)
{
    bx = bx|0;
    by = by|0;

    var master = this.icons.getElementById(name);
    var copy = document.importNode(master, true);
    parent.appendChild(copy);
    var bbox = copy.getBBox();
    parent.removeChild(copy);
    copy.setAttribute('transform', 'translate(' + (((bx - bbox.width - 2)/2) - bbox.x)  + ',' + (((by - bbox.height - 2)/2) - bbox.y)+ ')');
    var button = makeElementNS(NS_SVG, 'g', [
        makeElementNS(NS_SVG, 'rect', null, {
            x: 0,
            y: 0,
            width: bx,
            height: by,
            fill: 'rgb(230,230,250)',
            stroke: 'rgb(150,150,220)',
            strokeWidth: 2
        }), 
        copy ]);
    return button;
}
