
var final_def = function(edge, source, target, context, settings) {
    if (typeof edge.label !== 'string' || source == target)
      return;

    var prefix = settings('prefix') || '',
        size = edge[prefix + 'size'] || 1;

    if (size < settings('edgeLabelThreshold') && !edge.hover)
      return;

    if (0 === settings('edgeLabelSizePowRatio'))
      throw new Error('Invalid setting: "edgeLabelSizePowRatio" is equal to 0.');

    var fontSize,
        angle = 0,
        fontStyle = edge.hover ?
          (settings('hoverFontStyle') || settings('fontStyle')) :
          settings('fontStyle'),
        x = (source[prefix + 'x'] + target[prefix + 'x']) / 2,
        y = (source[prefix + 'y'] + target[prefix + 'y']) / 2,
        dX = target[prefix + 'x'] - source[prefix + 'x'],
        dY = target[prefix + 'y'] - source[prefix + 'y'],
        sign = (source[prefix + 'x'] < target[prefix + 'x']) ? 1 : -1;

    // The font size is sublineraly proportional to the edge size, in order to
    // avoid very large labels on screen.
    // This is achieved by f(x) = x * x^(-1/ a), where 'x' is the size and 'a'
    // is the edgeLabelSizePowRatio. Notice that f(1) = 1.
    // The final form is:
    // f'(x) = b * x * x^(-1 / a), thus f'(1) = b. Application:
    // fontSize = defaultEdgeLabelSize if edgeLabelSizePowRatio = 1
    

    fontSize = (settings('edgeLabelSize') === 'fixed') ?
      settings('defaultEdgeLabelSize') :
      settings('defaultEdgeLabelSize') *
      size *
      Math.pow(size, -1 / settings('edgeLabelSizePowRatio'));

    /*
    if (edge.active) {
      context.font = [
        settings('activeFontStyle') || settings('fontStyle'),
        fontSize + 'px',
        settings('activeFont') || settings('font')
      ].join(' ');
    }
    else {
      context.font = [
        fontStyle,
        fontSize + 'px',
        settings('font')
      ].join(' ');
    }*/

    context.textAlign = 'center';
    context.textBaseline = 'alphabetic';

    // force horizontal alignment if not enough space to draw the text,
    // otherwise draw text along the edge line:
    if ('auto' === settings('edgeLabelAlignment')) { //alwaysAligned setting
      angle = Math.atan2(dY * sign, dX * sign);
    }

    

    if (edge.hover) {
      // Label background:
      context.fillStyle = settings('edgeLabelHoverBGColor') === 'edge' ?
        (edge.color || settings('defaultEdgeColor')) :
        settings('defaultEdgeHoverLabelBGColor');

      if (settings('edgeLabelHoverShadow')) {
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = 8;
        context.shadowColor = settings('edgeLabelHoverShadowColor');
      }

      drawBackground(angle, context, fontSize, size, edge.label, x, y);

      if (settings('edgeLabelHoverShadow')) {
        context.shadowBlur = 0;
        context.shadowColor = '#000';
      }
    }



    if (edge.active) {
      context.fillStyle =
        settings('edgeActiveColor') === 'edge' ?
        (edge.active_color || settings('defaultEdgeActiveColor')) :
        settings('defaultEdgeLabelActiveColor');
    }
    else {
      context.fillStyle =
        (settings('edgeLabelColor') === 'edge') ?
        (edge.color || settings('defaultEdgeColor')) :
        settings('defaultEdgeLabelColor');
    }
    

    context.translate(x,y);
    context.rotate(angle);
    context.fillText(
      edge.label,
      0,
      (-size / 2) - 3
    );
    context.rotate(-angle);
    context.translate(-x,-y);

    

    function drawBackground(angle, context, fontSize, size, label, x, y) {
      var w = Math.round(
            context.measureText(label).width + size + 1.5 + fontSize / 3
          ),
          h = fontSize + 4;

      context.save();
      context.beginPath();

      // draw a rectangle for the label
      context.translate(x, y);
      context.rotate(angle);
      context.rect(-w / 2, -h -size/2, w, h);

      context.closePath();
      context.fill();
      context.restore();
    }

    
  }