// 
// Dalliance Genome Explorer
// (c) Thomas Down 2006-2010
//
// sequence-tier.js: renderers for sequence-related data
//

var MIN_TILE = 75;
var rulerTileColors = ['black', 'white'];
var baseColors = {A: 'green', C: 'blue', G: 'black', T: 'red'};
var steps = [1,2,5];

function tileSizeForScale(scale, min)
{
    if (!min) {
	min = MIN_TILE;
    }

    function ts(p) {
	return steps[p % steps.length] * Math.pow(10, (p / steps.length)|0);
    }
    var pow = steps.length;
    while (scale * ts(pow) < min) {
	++pow;
    }
    return ts(pow);
}

function drawGuidelines(featureGroupElement)
{
    if (guidelineStyle != 'background') {
	return;
    }

    var tile = tileSizeForScale(scale, guidelineSpacing);
    var pos = Math.max(0, ((knownStart / tile)|0) * tile);

    var seqTierMax = knownEnd;
    if (currentSeqMax > 0 && currentSeqMax < knownEnd) {
	seqTierMax = currentSeqMax;
    }

    for (var glpos = pos; glpos <= seqTierMax; glpos += tile) {
	var guideline = document.createElementNS(NS_SVG, 'line');
	guideline.setAttribute('x1', (glpos - origin) * scale);
	guideline.setAttribute('y1', 0);
	guideline.setAttribute('x2', (glpos - origin) * scale);
	guideline.setAttribute('y2', 1000);
	guideline.setAttribute('stroke', 'black');
	guideline.setAttribute('stroke-opacity', 0.2);
	guideline.setAttribute('stroke-width', 1);
	featureGroupElement.appendChild(guideline);
    }
}


function drawSeqTier(tier, seq)
{
    var featureGroupElement = tier.viewport;
    while (featureGroupElement.childNodes.length > 0) {
	featureGroupElement.removeChild(featureGroupElement.firstChild);
    }
    featureGroupElement.appendChild(tier.background);
    drawGuidelines(featureGroupElement);
    
    var tile = tileSizeForScale(scale);
    var pos = Math.max(0, ((knownStart / tile)|0) * tile);

    var seqTierMax = knownEnd;
    if (currentSeqMax > 0 && currentSeqMax < knownEnd) {
	seqTierMax = currentSeqMax;
    }
	
    while (pos <= seqTierMax) {
        var rect = document.createElementNS(NS_SVG, "rect");
        rect.setAttribute('x', (pos - origin) * scale);
        rect.setAttribute('y', 5);
        rect.setAttribute('height', 3);
        var rwid = Math.min(tile, seqTierMax - pos) * scale;
        rect.setAttribute('width', rwid);
        rect.setAttribute('fill', rulerTileColors[(pos / tile) % 2]);
        rect.setAttribute('stroke-width', 1);
        featureGroupElement.appendChild(rect);
        
        if ((pos / tile) % 2 == 0) {
            var labelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            labelText.setAttribute("x", ((pos - origin) * scale));
            labelText.setAttribute("y",  25);
            labelText.setAttribute("stroke-width", "0");
            labelText.setAttribute("fill", "black");
            labelText.setAttribute("class", "label-text");
            labelText.appendChild(document.createTextNode('' + pos));
            featureGroupElement.appendChild(labelText);
        }
	     
	    pos += tile;
	}
	
	var height = 30;
	
	if (seq) {
	    for (var i = seq.start; i <= seq.end; ++i) {
	        var base = seq.seq.substr(i - seq.start, 1).toUpperCase();
	        var color = baseColors[base];
	        if (!color) {
	            color = 'gray';
	        }
	        
	        if (scale >= 8) {
                var labelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
                labelText.setAttribute("x", ((i - origin) * scale));
                labelText.setAttribute("y",  45);
                labelText.setAttribute("stroke-width", "0");
                labelText.setAttribute("fill", color);
                labelText.setAttribute("class", "label-text");
                labelText.appendChild(document.createTextNode(base));
                featureGroupElement.appendChild(labelText);
                height = 50;
            } else {
                var rect = document.createElementNS(NS_SVG, "rect");
                rect.setAttribute('x', ((i - origin) * scale));
                rect.setAttribute('y', 30);
                rect.setAttribute('height', 8);
                rect.setAttribute('width', scale);
                rect.setAttribute('fill', color);
                rect.setAttribute('stroke', 'none');
                featureGroupElement.appendChild(rect);
                height = 42;
            }
        }
    }
	
    tier.layoutHeight = height;
    tier.background.setAttribute("height", height);
    tier.scale = 1;
    arrangeTiers();
}