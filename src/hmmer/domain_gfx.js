function PfamGraphic(parent, sequence) {
  this._middleClickListenerAdded = false;

  this._imageParams = {
    headSizeCircle:  3,
    headSizeSquare:  6,
    headSizeDiamond: 4,
    headSizeArrow:   3,
    headSizePointer: 3,
    headSizeLine:    3,

    sequenceEndPadding: 2,

    xOffset: 0,
    yOffset: 0,

    defaultMarkupHeight:         20,
    lollipopToLollipopIncrement: 7,
    bridgeToBridgeIncrement:     2,
    bridgeToLollipopIncrement:   5,
    largeJaggedSteps:            6,

    fontSize: "10px",

    regionHeight:    20,
    motifHeight:     14,
    motifOpacity:    0.6,
    labelPadding:    3,
    residueWidth:    0.5,
    xscale:          1.0,
    yscale:          1.0,
    envOpacity:      0.6,
    highlightWeight: 1,
    highlightColour: "#000000"
  };

  this._options = {
    baseUrl:   "",
    imageMap:  true,
    labels:    true,
    tips:      true,
    tipStyle:  "pfam",
    newCanvas: true
  };

  this._markupSpec = {
    valignValues:       ['top', 'bottom'],
    linesStyleValues:   ['mixed', 'bold', 'dashed'],
    lollipopHeadValues: ['diamond', 'circle', 'square', 'arrow', 'pointer', 'line'],
    regionEndValues:    ['curved', 'straight', 'jagged', 'arrow']
  };

  this._heights = {};
  this._areasHash = {};
  this._cache = {};
  this._saveLevel = 0;
  this._rendered_regions = {};
  this._highlighted = {};

  // support functions

  this._parseInt = function( value ) {
    if (value === undefined) {
      return;
    }
    var num = parseInt(value, 10);
    return (num !== "NaN") ? num : value;
  };

  this.capitalize = function (word) {
    return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
  };

  this._getRGBColour = function (hexString) {

    var longHexMatches  = /^#?([A-F0-9]{6})$/i.exec(hexString),
      shortHexMatches = /^#?([A-F0-9]{3})$/i.exec(hexString),
      h, r, g, b, rgb;

    if ( longHexMatches === null && shortHexMatches === null ) {
      this._throw( "not a valid hex color ('" + hexString + "')" );
    }

    if ( longHexMatches !== null ) {
      h = longHexMatches[1];
      r = parseInt( h.substring( 0, 2 ), 16 );
      g = parseInt( h.substring( 2, 4 ), 16 );
      b = parseInt( h.substring( 4, 6 ), 16 );
    } else if ( shortHexMatches !== null ) {
      h = shortHexMatches[1];
      r = parseInt( "" + h.substring( 0, 1 ) + h.substring( 0, 1 ), 16 );
      g = parseInt( "" + h.substring( 1, 2 ) + h.substring( 1, 2 ), 16 );
      b = parseInt( "" + h.substring( 2, 3 ) + h.substring( 2, 3 ), 16 );
    }

    rgb = [ r, g, b ];
    rgb.r = r;
    rgb.g = g;
    rgb.b = b;

    return rgb;
  };

  // end support functions

  this.setParent = function( parent ) {
    this._parent = $(parent);
    if ( !this._parent.length ) {
      this._throw( "couldn't find the parent node" );
    }

    return this;
  };

  if ( parent !== undefined ) {
    this.setParent( parent );
  }

  this._walkSequence = function() {
    var self = this;
    var s = this._sequence;
    s.length = this._parseInt( s.length );
    $.each([ s.motifs, s.regions, s.markups ], function( j ) {
       $.each(this, function(i) {
         this.start    = self._parseInt( this.start );
         this.end      = self._parseInt( this.end );
         this.aliStart = self._parseInt( this.aliStart );
         this.aliEnd   = self._parseInt( this.aliEnd );
       });
    });
  };

  this._buildMarkups = function() {
    var self = this;

    var heights = { lollipops: { up:   [],
                                 down: [],
                                 markups: [],
                                 downMax: 0,
                                 upMax: 0 },
                    bridges:   { up:   [],
                                 down: [],
                                 markups: [],
                                 downMax: 0,
                                 upMax: 0 } },
        bridgeMarkups   = [],
        ip              = this._imageParams,
        ms              = this._markupSpec;

    var orderedMarkups = [];
    $.each(this._sequence.markups, function(i, markup ) {

      var start = Math.floor( markup.start );
      if ( start === "NaN" ) {
        this._throw( "markup start position is not a number: '" +
                     markup.start + "'" );
      }

      if ( orderedMarkups[markup.start] === undefined ) {
        orderedMarkups[markup.start] = [];
      }

      orderedMarkups[markup.start].push( markup );
    });

    orderedMarkups = $.map(orderedMarkups, function(i) {
          return i;
        });

    var residueWidth = this._imageParams.residueWidth;

    $.each(orderedMarkups, function( i, markup ) {

      var start = Math.floor( markup.start );
      if ( start === "NaN" ) {
        this._throw( "markup start position is not a number: '" +
               markup.start + "'" );
      }

      if ( markup.end === undefined ) {
        heights.lollipops.markups.push( markup );
      } else {
        bridgeMarkups.push( markup );
        return;
      }

      if ( markup.v_align !== undefined &&
           $.inArray(markup.v_align, ms.valignValues) === -1) {
        this._throw( "markup 'v_align' value is not valid: '" +
                     markup.v_align + "'" );
      }

      if ( markup.headStyle !== undefined &&
           $.inArray(markup.headStyle, ms.lollipopHeadValues) === -1) {
        this._throw( "markup 'headStyle' value is not valid: '" +
                     markup.headStyle + "'" );
      }

      var up = ( markup.v_align === undefined || markup.v_align === "top" );

      var h = up ? heights.lollipops.up : heights.lollipops.down;

      if ( h[ start - ( 1 / residueWidth ) ] !== undefined ||
           h[ start                        ] !== undefined ||
           h[ start + ( 1 / residueWidth ) ] !== undefined ) {

        var firstLollipopHeight = Math.max.apply(Math, h.slice( start - ( 1 / residueWidth ),
                                           start + ( 1 / residueWidth ) ));
        h[ start ] = firstLollipopHeight + ip.lollipopToLollipopIncrement;

      } else {

        h[start] = ip.defaultMarkupHeight;

      }

      var headSize = ip["headSize" + self.capitalize(markup.headStyle)];

      if ( up ) {
        heights.lollipops.upMax = Math.max( h[start] + headSize,
                                            heights.lollipops.upMax );
      } else {
        heights.lollipops.downMax = Math.max( h[start] + headSize,
                                              heights.lollipops.downMax );
      }

    });

    $.each(bridgeMarkups, function(i, bridgeMarkup ) {


      var bridge = { markup: bridgeMarkup };

      heights.bridges.markups.push( bridge );

      var start = Math.floor( bridgeMarkup.start );
      if ( start === "NaN" ) {
        this._throw( "bridge start position is not a number: '" + bridgeMarkup.start + "'" );
      }

      var end = Math.floor( bridgeMarkup.end );
      if ( end === "NaN" ) {
        this._throw( "bridge end position is not a number: '" + bridgeMarkup.end + "'" );
      }

      bridge.up = ( bridgeMarkup.v_align === undefined || bridgeMarkup.v_align === "top" );
      var hl = bridge.up ? heights.lollipops.up : heights.lollipops.down,
          hb = bridge.up ? heights.bridges.up   : heights.bridges.down;

      var maxBridgeHeight = Math.max.apply(Math, $.map(hb.slice( start, end ), function (i) { return i }));
      var bridgeHeight = ip.defaultMarkupHeight;

      if ( maxBridgeHeight === -Infinity ) {
        //do nothing
      }
      else {
        if ( $.inArray( bridgeHeight, $.map(hb.slice( start, end ), function (i) { return i})) >= 0) {
          bridgeHeight = maxBridgeHeight + ip.bridgeToBridgeIncrement;
        }
      }

      var maxLollipopHeight = Math.max.apply(Math, hl.slice( start - 4, end + 4 ));

      if ( maxLollipopHeight !== undefined ) {
        if ( ( maxLollipopHeight + ip.bridgeToLollipopIncrement ) >= bridgeHeight ) {
          bridgeHeight = maxLollipopHeight + ip.bridgeToLollipopIncrement;
        }
      }

      bridge.height = bridgeHeight;

      for (var i= start; i <= end ;i++) {
        if ( hb[i] === undefined ) {
          hb[i] = [];
        }
        hb[i].push( bridgeHeight );
      }

      if ( bridge.up ) {
        heights.bridges.upMax = Math.max( bridgeHeight, heights.bridges.upMax ) + 2;
      } else {
        heights.bridges.downMax = Math.max( bridgeHeight, heights.bridges.downMax ) + 2;
      }

    });

    this._heights = heights;

  };

  this.setImageParams = function ( params ) {
    if ( params !== undefined ) {
      if ( typeof params !== "object" ) {
        this._throw( "'imageParams' must be a valid object" );
      }
      this._imageParams = $.extend( this._imageParams, params );
    }
  };

  this.setSequence = function( sequence ) {

    if ( typeof sequence !== "object" ) {
      this._throw( "must supply a valid sequence object" );
    }

    if ( sequence.length === undefined ) {
      this._throw( "must specify a sequence length" );
    }

    if ( isNaN( sequence.length ) ) {
      this._throw( "sequence length must be a valid number" );
    }

    if ( parseInt( sequence.length, 10 ) <= 0 ) {
      this._throw( "sequence length must be a positive integer" );
    }

    if ( sequence.regions !== undefined ) {
      if ( typeof sequence.regions !== "object" ) {
        this._throw( "'regions' must be a valid object" );
      }
    }
    else {
      sequence.regions = [];
    }

    if ( sequence.markups !== undefined ) {
      if ( typeof sequence.markups !== "object" ) {
        this._throw( "'markups' must be a valid object" );
      }
    }
    else {
      sequence.markups = [];
    }

    if ( sequence.motifs !== undefined ) {
      if ( typeof sequence.motifs !== "object" ) {
        this._throw( "'motifs' must be a valid object" );
      }
    }
    else {
      sequence.motifs = [];
    }

    if ( sequence.options !== undefined ) {
      if ( typeof sequence.options !== "object" ) {
        this._throw( "'options' must be a valid object" );
      }
      this._options = $.extend( this._options, sequence.options );
    }

    if ( sequence.imageParams !== undefined ) {
      if ( typeof sequence.imageParams !== "object" ) {
        this._throw( "'imageParams' must be a valid object" );
      }
      this.setImageParams( sequence.imageParams );
    }

    this._sequence = sequence;

    this._walkSequence();

    this._imageWidth = (this._sequence.length * this._imageParams.residueWidth) + this._imageParams.sequenceEndPadding;

    if (this._parent.width() < this._imageWidth) {
      this._imageWidth = this._parent.width();
    }

    this._regionHeight = this._imageParams.regionHeight;

    this._seqHeight = Math.round( this._regionHeight / 6 );

    this._seqStep   = Math.round( this._seqHeight / 5 );

    this._buildMarkups();

    this._canvasHeight = Math.max.apply(Math, [ this._heights.lollipops.upMax,
                           this._heights.bridges.upMax,
                           ( this._regionHeight / 2 + 1 ) ]) +
                         Math.max.apply(Math, [ this._heights.lollipops.downMax,
                           this._heights.bridges.downMax,
                           ( this._regionHeight / 2 + 1 ) ]) + 5;

    this._canvasHeight *= this._imageParams.yscale;

    if ( this._sequence.highlight !== undefined ) {
      this._canvasHeight += ( 5 + Math.ceil( this._imageParams.highlightWeight / 2 ) );
    }

    this._canvasWidth = this._imageWidth + 1 + (this._imageParams.sequenceEndPadding * 2);

    this._canvasWidth *= this._imageParams.xscale;

    this._baseline = Math.max.apply(Math, [ this._heights.lollipops.upMax,
                       this._heights.bridges.upMax,
                       this._imageParams.regionHeight / 2 ]) + 1;

    return this;
  };

  if ( sequence !== undefined ) {

    this.setSequence( sequence );
  }

  this._throw = function( message ) {
    throw { name: "PfamGraphicException",
            message: message,
            toString: function() { return this.message; } };
  };

  this.highlight = function(params) {
    // return unless we have a region name
    if ( params.uniq === undefined ) {
      return;
    }

    if (this._rendered_regions[params.uniq] === undefined) {
      return;
    }

    if ( params.status === undefined || params.status === 'on') {
      // highlight the named region
      if(!this._highlighted[params.uniq]) {
        this._highlighted[params.uniq] = [];
      }
      for (var i = 0; i < this._rendered_regions[params.uniq].length; i++) {
        this._highlighted[params.uniq][i] = this._rendered_regions[params.uniq][i].glow({width: 5, opacity:0.6});
      }
    }
    else {
      // turn off the highlight
      for (var i = 0; i < this._highlighted[params.uniq].length; i++) {
        this._highlighted[params.uniq][i].remove();
      }
      delete this._highlighted[params.uniq];
    }
  }

  this.render = function( parent, sequence ) {

    if ( sequence !== undefined ) {
      this.setSequence( sequence );
    }
	console.log("rendering");
    if ( parent !== undefined ) {
      this.setParent( parent );
    }

    if ( this._sequence === undefined ) {
      this._throw( "sequence was not supplied" );
    }

    if ( this._options.newCanvas &&
         this._parent === undefined ) {
      this._throw( "parent node was not supplied" );
    }

    if ( ( ! this._canvas ) || this._options.newCanvas ) {
      this._buildCanvas( this._canvasWidth, this._canvasHeight );
    }

    var all_elements = this._draw();
    this._drawTitle(all_elements);

    // draw the sliding marker
    var marker = this._canvas.rect(-100, 0, 1, this._canvas.height)
      .attr({"fill" : "#666666", "stroke-opacity" : 0});

    var self = this;
    function scale(coord, orig, desired) {
      var scaled = (desired * coord) / orig;
      return scaled;
    };

    this._parent.find('svg').on('coverage.move', function (e, position) {
      var seq_length_in_px = (self._canvas.width - 100) - (self._labelWidth + 7);
      var x = Math.round(scale(position, self._sequence.length, seq_length_in_px ) + 100);
      marker.attr({x: x});
    });
    // end the sliding marker

    return this;
  };

  this._drawTitle = function (graphics) {
    if (this._sequence.title === undefined) {
      return;
    }
    //shift all the graphics to the right
    graphics.transform("t100,0");
    this._canvas.setSize(this._canvas.width + 100, this._canvas.height);
    this._canvas.text(50, (this._canvas.height / 2) - 2, this._sequence.title);
  };

  this.resize = function(width, height) {

    if (width > this._canvasWidth) {
      return;
    }

    if(!width) {
      width = this._canvasWidth;
    }
    if (!height) {
      height = this._canvasHeight;
    }

    var seq_length = this._sequence.length * this._imageParams.residueWidth;

    if (this._sequence.title) {
      seq_length = seq_length + 100;
    }

    if (this._labelWidth) {
      seq_length = seq_length + this._labelWidth + 5;
    }

    this._canvas.setSize(width, height);
    this._canvas.setViewBox(0, 0, seq_length, height);
    return this;
  }

  this._buildCanvas = function( width, height ) {
    var wrapperDiv = this._parent.closest("div");
    if ( wrapperDiv && width > wrapperDiv.scrollWidth ) {
      this._parent.addClassName( "canvasScroller" );
    }

    var canvas = Raphael(this._parent.get(0), width, height);

    this._canvas = canvas;

    if ( this._canvas === undefined || this._canvas === null ) {
      this._throw( "couldn't find the canvas node" );
    }

    this._areasList = [];

    return this;
  };

  this._drawRegion = function( region ) {

    if ($.inArray(region.startStyle, this._markupSpec.regionEndValues) === -1) {
      this._throw( "region start style is not valid: '" + region.startStyle + "'" );
    }

    if ($.inArray(region.endStyle, this._markupSpec.regionEndValues) === -1) {
      this._throw( "region end style is not valid: '" + region.endStyle + "'" );
    }

    var height = Math.floor( this._regionHeight ) - 2,
        radius = Math.round( height / 2 ),
        arrow  = radius,
        width  = ( region.end - (region.start + 1) ) * this._imageParams.residueWidth + 1,

        x = Math.max( 1, Math.floor( region.start * this._imageParams.residueWidth )),
        y = Math.floor( this._baseline - radius ) + 0.5;


    if ((arrow * 2) > width) {
      arrow = (width/2);
      radius = arrow;
    }

    var  regionParams = {
          x: x,
          y: y,
          w: width,
          h: height,
          r: radius,
          a: arrow,
          s: region.startStyle,
          e: region.endStyle
        };


    var path = this._buildRegionPath( regionParams, region);

    var fill = "90-#fff-" + region.color + ":50-" + region.color+ ":70-#fff";
    var glyph = this._canvas.path(path).attr({stroke: region.color, fill: fill});

    if (region.metadata) {

      if (!this._rendered_regions[region.metadata._uniq]) {
        this._rendered_regions[region.metadata._uniq] = [];
      }

      this._rendered_regions[region.metadata._uniq].push(glyph);
    }

    var areas;
    if ( region.aliStart !== undefined && region.aliEnd !== undefined ) {
      areas = this._drawEnvelope( region, radius, height );
    }

    if ( this._options.labels ) {
      this._drawText( x, this._baseline, width, region.text );
    }

    var area = this._canvas.rect(x,y,width,height).attr({opacity: 0, fill: '#000'});

    this._buildTip( region, area );

  };

  this._buildTip = function( item, glyph, type) {
    if ($.fn.qtip === undefined) return;

    if ( item.metadata === undefined ) {
      return;
    }

    var md = item.metadata;

    var tipTitle;
    if ( md.accession !== undefined && md.identifier !== undefined ) {
      tipTitle = md.identifier + " (" + md.accession.toUpperCase() + ")";
    } else if ( md.identifier !== undefined ) {
      tipTitle = md.identifier;
    } else if ( md.accession !== undefined ) {
      tipTitle = md.accession.toUpperCase();
    } else {
      tipTitle = md.type;
    }

    var coords = '<span class="inactive">n/a</span>';
    if ( md.start !== undefined && md.end !== undefined ) {
      coords = md.start + " - " + md.end;
      if ( md.aliStart !== undefined && md.aliEnd !== undefined ) {
        coords = coords.concat( " (alignment region " + md.aliStart + " - " + md.aliEnd + ")" );
      }
    }

    var desc = ( md.description || '<span class="inactive">n/a</span>' );
    if (md.accession) {
      desc = desc + ' [<a href="' + item.href  + '" class="ext">' + md.database + '</a>]';
    }
    if (type && type === 'motif') {
      if (md.href) {
        desc = md.description + ' [<a href="' + md.href + '" class="ext">' + md.src + '</a>]';
      }
    }

    var model = null;

    if (item.modelStart) {
      // work out the width of the match
      var match_width = item.modelEnd - item.modelStart + 1;
      var scaled_match_width = (match_width * 200) / item.modelLength;
      // work out the start
      var scaled_start = (item.modelStart - 1) / (item.modelLength / 200) ;
      var match = '<span style="width:' + scaled_match_width + 'px;background: '+
        item.color +';left:' + scaled_start + 'px"></span>';

      model = '1 <span class="model_position">' +  match  + '</span> ' + item.modelLength;
    }


    var tipBody = '    <dt>Description:</dt>' +
      '    <dd>' + desc  +'</dd>' +
      '    <dt>Coordinates:</dt>' +
      '    <dd>' + coords + '</dd>';

    if (model) {
      tipBody = tipBody +  '<dt>Model Match:</dt><dd>' + model + '</dd>';
    }

    tipBody = '<div class="tipContent"><dl>' + tipBody + '  </dl></div>';
    $(glyph.node).qtip({
      position: {
        viewport: $(window),
        my: 'bottom center',
        at: 'top center'
      },
      content: {
        title: tipTitle,
        text: tipBody
      },
      show: {
        solo: true
      },
      hide: {
        event: 'unfocus',
        inactive: 2000
      },
      style: {
        classes: 'ui-tooltip-hmmer ui-tooltip-rounded'
      }
    });
  }
  this._drawText = function( x, midpoint, regionWidth, text ) {

    var textX = x + ( regionWidth / 2 );
    var ts = this._canvas.text( textX, midpoint, text)
              .attr({stroke: '#eee', 'stroke-width': 2, 'stroke-opacity': 0.7});

    var bbox = ts.getBBox();

    if (bbox.width > regionWidth || bbox.height > this._regionHeight ) {
      ts.remove();
    }
    else {
      var t = this._canvas.text( textX, midpoint, text);
    }

  };

  this._drawEnvelope = function( region, radius, height ) {

    if ( parseInt( region.start, 10 ) > parseInt( region.aliStart, 10 ) ) {
      this._throw( "regions must have start <= aliStart (" + region.start + " is > " + region.aliStart + ")" );
    }

    if ( parseInt( region.end, 10 ) < parseInt( region.aliEnd, 10 ) ) {
      this._throw( "regions must have end >= aliEnd (" + region.end + " is < " + region.aliEnd + ")" );
    }

    var y  = this._baseline - radius,
        xs = this._imageParams.residueWidth,
        l,
        r;

    if ( region.aliStart &&
         region.aliStart > region.start ) {
      l = { x: Math.floor( region.start * xs ),
            y: Math.floor( y - 1 ) + 1,
            w: Math.floor( region.aliStart * xs ) - Math.floor( region.start * xs ) + 1,
            h: height + 1 };
    }

    if ( region.aliEnd &&
         region.aliEnd < region.end ) {
      r = { x: Math.floor( region.aliEnd * xs ) + 1,
            y: Math.floor( y - 1 ) + 1,
            w: Math.floor( region.end * xs ) - Math.floor( region.aliEnd * xs ),
            h: height + 1 };
    }

    var fillStyle = { opacity: this._imageParams.envOpacity,
                       fill: '#ffffff', stroke: '#ffffff' };

    if ( l !== undefined ) {
      this._canvas.rect( l.x, l.y, l.w, l.h ).attr(fillStyle);
    }

    if ( r !== undefined ) {
      this._canvas.rect( r.x, r.y, r.w, r.h ).attr(fillStyle);
    }

  };

  this._buildRegionPath = function( params, region ) {
    var path = "M";

    // move to top left of region
    // draw left side down to bottom of region
    switch ( params.s ) {
      case "curved":
        path += (params.x + params.r) + " " + params.y;
        path += this._drawLeftRounded( params.r, params.h );
        break;
      case "jagged":
        path += params.x + " " + params.y;
        path += this._drawJagged( params.x, params.y, params.h, true );
        break;
      case "straight":
        path += params.x + " " + params.y;
        path += "l0 " + params.h;
        break;
      case "arrow":
        path += (params.x + params.a) + " " + params.y;
        path += this._drawLeftArrow( params.a, params.h );
        break;
    }

    // draw horizontal line from bottom left to bottom right
    if ( params.s.match(/^curved|arrow$/) && params.e.match(/^curved|arrow$/) ) {
      var l_width = (params.w - (params.r * 2));
      if (l_width < 0) {
        l_width = 0;
      }
      path += "l" + l_width + " 0";
    }
    else if ( params.s.match(/^curved|arrow$/) || params.e.match(/^curved|arrow$/) ) {
      path += "l" + (params.w - params.r) + " 0";
    }
    else {
      path += "l" + params.w + " 0";
    }


    // draw right side up to top of region
    switch ( params.e ) {
      case "curved":
        path += this._drawRightRounded( params.r, params.h );
        break;
      case "jagged":
        path += this._drawJagged( params.x + params.w, params.y + params.h, params.h, false );
        break;
      case "straight":
        path += "l0 -" + params.h;
        break;
      case "arrow":
        path += this._drawRightArrow( params.a, params.h );
        break;
    }

    // close path - complete line from right to left top
    path += "z";
    return path;

  };

  this._drawRightRounded = function( radius, height ) {
    var radius = radius + 2;
    return "c" + radius + " " + 0 + " " + radius + " " + -height + " " + 0 + " " + -height;
  };

  this._drawLeftRounded = function( radius, height ) {
    var radius = radius + 2;
    return "c" + -radius + " " + 0 + " " + -radius + " " + height + " " + 0 + " " + height;
  };

  this._drawLeftArrow = function( arrow, height ) {
    var path = "l" + -arrow + " " + (height/2) + "l" + arrow + " " + (height/2);
    return path;
  };

  this._drawRightArrow = function( arrow, height ) {
    var path = "l" + arrow + " " + -(height/2) + "l" + -arrow + " " + -(height/2);
    return path;
  };

  this._drawJagged = function( x, y, height, left ) {

    var steps = parseInt( this._imageParams.largeJaggedSteps, 10 );
    steps += steps % 2;

    var yShifts = this._getSteps( height, steps );

    var step = height / steps;

    var path = '';

    for ( var i = 0; i < yShifts.length; i = i + 1 ) {
      if ( i % 2 !== 0 ) {
        if ( left ) {
          path += "L" + x + " " + (y + yShifts[i]);
        } else {
          path += "L" + x + " " + (y - yShifts[i]);
        }
      }
      else {
        if ( left ) {
          path += "L" + (x + step) + " " + (y + yShifts[i]);
        } else {
          path += "L" + (x - step) + " " + (y - yShifts[i]);
        }
      }
    }

    if ( left ) {
      path += "L" + x + " " + (y + height);
    } else {
      path += "L" + x + " " + (y - height);
    }
    return path;
  };

  this._getSteps = function( height, steps ) {

    var cacheKey = "shifts_" + height + "_" + steps;
    var list = this._cache[cacheKey];

    if ( list === undefined ) {

      var step = height / steps;

      var yShifts = [];
      for ( var i = 0; i < ( steps / 2 ); i = i + 1 ) {
        yShifts.push( ( height / 2 ) - ( i * step ) );
        yShifts.push( ( height / 2 ) + ( i * step ) );
      }

      list = $.unique(yShifts).sort( function (a, b) { return a - b; } );

      this._cache[cacheKey] = list;
    }

    return list;
  };

  this._drawBridge = function( bridge ) {
    var self = this;

    var start  = bridge.markup.start,
        end    = bridge.markup.end,
        height = bridge.height,
        up     = bridge.up,

        color = "#000000",

        x1 = Math.floor( start * this._imageParams.residueWidth ) + 1.5,
        x2 = Math.floor( end   * this._imageParams.residueWidth ) + 1.5,
        y1 = Math.round( up ? this._topOffset : this._botOffset ) + 0.5,
        y2,
        label,

        xo = this._imageParams.xOffset, // need X- and Y-offsets
        yo = this._imageParams.yOffset;


    if ( up ) {
      y2 = Math.ceil( this._baseline - height ) - 0.5;
    } else {
      y2 = Math.floor( this._baseline + height ) + 0.5;
    }

    if ( bridge.markup.color.match( "^\\#[0-9A-Fa-f]{6}$" ) ) {
      color = bridge.markup.color;
    }

    var path = "M" + x1 + " " + y1 + "L" + x1 + " " + y2 + "L" + x2 + " " + y2 + "L" + x2 + " " + y1;
    var strokeColor = color || "#000";
    this._canvas.path(path).attr({ 'stroke': strokeColor });

    var tip = {};

    if ( bridge.markup.metadata ) {
      var md = bridge.markup.metadata;

        tip.title = self.capitalize( md.type || "Bridge" );
        tip.body =
          '<div class="tipContent">' +
          '  <dl>' +
          '    <dt>Coordinates:</dt>' +
          '    <dd>' + md.start + '-' + md.end + '</dd>' +
          '    <dt>Source:</dt>' +
          '    <dd>' + ( md.database || '<span class="na">n/a</span>' ) + '</dd>' +
          '  </dl>' +
          '</div>';
    }

    var ys = [ y1, y2 ].sort(function( a, b ) { return a - b; } );
    this._areasList.push( { start:  start,
                            type:   "bridge-start",
                            color: color,
                            end:    end,
                            tip:    tip,
                            coords: [ xo + x1 - 1, yo + ys[0] - 1, 
                                      xo + x1 + 1, yo + ys[1] + 1 ] } );
    this._areasList.push( { start:  start,
                            type:   "bridge-horizontal",
                            color: color,
                            end:    end,
                            tip:    tip,
                            coords: [ xo + x1 - 1, yo + ys[1] - 1, 
                                      xo + x2 + 1, yo + ys[1] + 1 ] } );
    this._areasList.push( { start:  start,
                            type:   "bridge-end",
                            color: color,
                            end:    end,
                            tip:    tip,
                            coords: [ xo + x2 - 1, yo + ys[0] - 1, 
                                      xo + x2 + 1, yo + ys[1] + 1 ] } );

  };

  this._drawLollipopHead = function( x, y1, y2, start, up, style, color, lineColour, tip, metadata ) {

    var xo = this._imageParams.xOffset,
        yo = this._imageParams.yOffset,
        r,
        d;

    switch ( style ) {

      case "circle":
        r = this._imageParams.headSizeCircle;

        var strokeColor = color || "#f00";
        this._canvas.circle(x, y2, r).attr({ fill: strokeColor, stroke: strokeColor });

        this._areasList.push( { tip:      tip,
                                type:     "lollipop-head",
                                shape:    "circle",
                                color:   color || "red",
                                start:    start,
                                coords:   [ xo + x - r, yo + y2 - r, 
                                            xo + x + r, yo + y2 + r ] } );
        break;

      case "square":
        d = this._imageParams.headSizeSquare / 2;
        var strokeColor = color || "#64C809"; //rgb(100, 200, 9)
        this._canvas.rect(x - d, y2 - d, d * 2, d * 2)
                      .attr({ fill: strokeColor, stroke: strokeColor });

        this._areasList.push( { tip:      tip,
                                type:     "lollipop-head",
                                start:    start,
                                color:   color || "rgb(100, 200, 9)",
                                coords:   [ xo + x - d, yo + y2 - d, 
                                            xo + x + d, yo + y2 + d ] } );
        break;

      case "diamond":
        d = this._imageParams.headSizeDiamond;
        var strokeColor = color || "#64C809";
        this._canvas.rect(x - (d/2), y2 - (d/2), d, d)
                      .attr({ fill: strokeColor, stroke: strokeColor })
                      .rotate(45);

        this._areasList.push( { tip:      tip,
                                ty2pe:     "lollipop-head",
                                shape:    "poly",
                                start:    start,
                                color:   color || "rgb(100, 200, 9)",
                                coords:   [ xo + x - d, yo + y2 - d, 
                                            xo + x + d, yo + y2 + d ] } );
        break;

      case "line":
        d = this._imageParams.headSizeLine;
        var path = "M" + x + " " + (y2 - d) + "L" + x + " " + (y2 + d);
        var strokeColor = color || "#3228ff"; // rgb(50, 40, 255)
        this._canvas.path(path).attr({ 'stroke': strokeColor });
        this._areasList.push( { tip:      tip,
                                type:     "lollipop-head",
                                start:    start,
                                color:   color || "rgb(50, 40, 255)",
                                coords:   [ xo + x - 1, yo + y2 - d - 1,
                                            xo + x + 1, yo + y2 + d + 1 ] } );
        break;

      case "arrow":
        d = this._imageParams.headSizeArrow;

        var coords;
        if ( up ) {
          var path = "M" + x + " " + y2 + "L" + x + " " + (y2 - d);
          var strokeColor = lineColour || "#000";
          this._canvas.path(path).attr({ 'stroke': strokeColor });

          var path = "M" + (x - d)  + " " + (y2 + d * 0.5) + "L" + x + " " + (y2 - d) + "L" + (x + d) + " " + (y2 + d * 0.5);
          var strokeColor = color || "#3228ff"; // rgb(50, 40, 255)
          this._canvas.path(path).attr({ 'stroke': strokeColor });

          coords = [ xo + x - d, yo + y2, 
                     xo + x + d, yo + y2 + d * 0.5 ];
        } else { 
          this._context.beginPath();
          this._context.moveTo( x,     y2  );
          this._context.lineTo( x,     y2 + d );
          this._context.strokeStyle = lineColour || "#000000";  
          this._context.stroke();
          this._context.beginPath();
          this._context.moveTo( x - d, y2 - d * 0.5 );
          this._context.lineTo( x,     y2 + d );
          this._context.lineTo( x + d, y2 - d * 1.5 );


          coords = [ xo + x - d, yo + y2 - d * 1.5, 
                     xo + x + d, yo + y2 - d ];
        }
        this._areasList.push( { tip:      tip,
                                type:     "lollipop-head",
                                color:   color || "rgb(50, 40, 255)",
                                start:    start,
                                shape:    "poly",
                                coords:   coords } );
        break;

      case "pointer":
        d = this._imageParams.headSizePointer;

        var coords;
        if ( up ) {
          var path = "M" + (x - d) + " " + (y1 - d * 1.5) + "L" + x + " " + (y1) + "L" + ( x + d) + " " + (y1 - d * 1.5);
          var strokeColor = color || "#3228ff"; // rgb(50, 40, 255)
          this._canvas.path(path).attr({ 'stroke': strokeColor });
          coords = [ xo + x - d, yo + y1, 
                     xo + x + d, yo + y1 - d ];
        } else { 
          var path = "M" + (x - d) + " " + (y1 + d * 1.5) + "L" + x + " " + (y1) + "L" + ( x + d) + " " + (y1 + d * 1.5);
          var strokeColor = color || "#3228ff"; // rgb(50, 40, 255)
          this._canvas.path(path).attr({ 'stroke': strokeColor });
          coords = [ xo + x - d, yo + y1 + d, 
                     xo + x + d, yo + y1 ];
        }

        this._areasList.push( { tip:      tip,
                                type:     "lollipop-head",
                                color:   color || "rgb(50, 40, 255)",
                                start:    start,
                                shape:    "poly",
                                coords:   coords } );
        break;
    }

  };

  this._drawHit = function( hit ) {
    var self = this;
    var xs = this._imageParams.residueWidth;
    var len = Math.floor(hit.tend * xs) - Math.floor(hit.tstart * xs);
    var fillStyle = {
      fill: '#666666',
      stroke: '#000000',
      opacity: 1
    };
    var x = Math.floor( hit.tstart * xs )
    var y = this._canvasHeight - 4;
    var glyph = this._canvas.rect( x, y, len, 2 ).attr(fillStyle);

    $(glyph.node).qtip({position: {
        viewport: $(window),
        my: 'left top',
        at: 'right center'
      },
      content: {
        title: 'Match Coordinates',
        text: '<dl class="narrow"><dt>Target: </dt><dd>' + hit.tstart + ' - ' + hit.tend + '</dd><dt>Query: </dt><dd>' + hit.qstart + ' - ' + hit.qend + '</dd></dl>'
      },
      show: {
        solo: true
      },
      style: {
        classes: 'ui-tooltip-hmmerdist ui-tooltip-rounded'
      }
    });
  };

  this._drawLollipop = function( markup ) {
    var self = this;

    var start = markup.start,

        up = markup.v_align === undefined || markup.v_align === "top",

        x1 = Math.floor( start * this._imageParams.residueWidth ) + 1.5,
        y1,
        y2;

    if ( up ) {
      y1 = Math.round( this._topOffset + 1 ) - 0.5;
      y2 = Math.floor( y1 - this._heights.lollipops.up[start] + ( this._baseline - this._topOffset ) + 1 );
    } else {
      y1 = Math.round( this._botOffset + 1 ) - 0.5;
      y2 = Math.ceil( y1 + this._heights.lollipops.down[start] - ( this._botOffset - this._baseline ) - 1 );
    }

    var path = "M" + x1 + " " + y1 + "L" + x1 + " " + y2;
    var strokeColor = markup.lineColour || "#000000";
    this._canvas.path(path).attr({ 'stroke': strokeColor });

    var xo = this._imageParams.xOffset,
        yo = this._imageParams.yOffset;

    var ys = [ y1, y2 ].sort(function( a, b ) { return a - b; } );
    var area = { start:    start,
                 type:     "lollipop",
                 coords:   [ xo + Math.floor( x1 ) - 1, yo + ys[0] - 1, 
                             xo + Math.floor( x1 ) + 1, yo + ys[1] + 1 ] };
    this._areasList.push( area );

    if ( markup.href !== undefined ) {
      area.href = markup.href;
    }

    var tip = {};

    if ( markup.metadata ) {
      var md = markup.metadata;

        tip.title = self.capitalize( md.type || "Annotation" );
        tip.body =
          '<div class="tipContent">' +
          '  <dl>' +
          '    <dt>Description:</dt>' +
          '    <dd>' + md.description + '</dd>' +
          '    <dt>Position:</dt>' +
          '    <dd>' + md.start + '</dd>' +
          '    <dt>Source:</dt>' +
          '    <dd>' + ( md.database || '<span class="na">n/a</span>' ) + '</dd>' +
          '  </dl>' +
          '</div>';
    }
    area.tip = tip;

    if ( markup.headStyle ) {
      this._drawLollipopHead( x1, y1, y2, start, up, markup.headStyle,
                              markup.color, markup.lineColour, area.tip,
                              markup.metadata );
    }

  };

  this._draw = function() {

    var self = this;
    this._canvas.setStart();

    if ( this._applyImageParams ) {

      var ip = this._imageParams;

      this._applyImageParams = false;
    }

    var seqArea = this._drawSequence();

    $.each(this._heights.bridges.markups, function(i, bridge ) {
      if ( bridge.display !== undefined &&
           bridge.display !== null &&
           ! bridge.display ) {
        return;
      }
      self._drawBridge( bridge );
    });

    $.each(this._heights.lollipops.markups.reverse(), function(i, lollipop ) {
      if ( lollipop.display !== undefined &&
           lollipop.display !== null &&
           ! lollipop.display ) {
        return;
      }
      self._drawLollipop( lollipop );
    });

    $.each(this._sequence.regions, function(i, region) {
      if ( region.display !== undefined &&
           region.display !== null &&
           ! region.display ) {
        return;
      }
      self._drawRegion( region );
    });

    if (this._sequence.hits) {
      $.each(this._sequence.hits, function(i, hit) {
        self._drawHit( hit );
      });
    }

    $.each(this._sequence.motifs, function(i, motif ) {
      if ( motif.display !== undefined &&
           motif.display !== null &&
           ! motif.display ) {
        return;
      }
      self._drawMotif( motif );
    });

    if ( this._sequence.highlight !== undefined &&
         parseInt( this._sequence.highlight.start, 10 ) &&
         parseInt( this._sequence.highlight.end, 10 ) ) {
      this._drawHighlight();
    }

    return this._canvas.setFinish();
  };

  this._drawMotif = function( motif ) {
    var self = this;

    motif.start = parseInt( motif.start, 10 );
    motif.end   = parseInt( motif.end,   10 );

    var height = Math.floor( this._imageParams.motifHeight ) - 2,
        radius = Math.round( height / 2 ),
        width  = ( motif.end - motif.start + 1 ) * this._imageParams.residueWidth,

        x = Math.max( 1, Math.floor( motif.start * this._imageParams.residueWidth ) + 1 ),
        y = Math.floor( this._baseline - radius ) + 0.5;

    var motifColour;

    var glyph = undefined;

    if ( motif.color instanceof Array ) {

      if ( motif.color.length !== 3 ) {
        this._throw( "motifs must have either one or three colors" );
      }

      color = [];

      var ip = this._imageParams;

      $.each(motif.color, function( i, c ) {
        var rgbColour = self._getRGBColour( c );
        color.push( { rgb:  "rgb("  + rgbColour.join(",") + ")",
                       rgba: "rgba(" + rgbColour.join(",") + "," + ip.motifOpacity + ")" } );
      });

      var step   = Math.round( height / 3 );
      for ( var i = 0; i < 3; i = i + 1 ) {
        glyph = this._canvas.rect(x, y + ( step * i), width, step).attr({fill: color[i].rgb, 'stroke-opacity':0});
      }

    }
    else {

      color = this._getRGBColour( motif.color );
      var rgb  = "rgb(" + color.join(",") + ")";
      var rgba = "rgba(" + color.join(",") + "," + this._imageParams.motifOpacity + ")";

      glyph = this._canvas.rect(x, y, width, parseInt( height, 10 ) + 1 )
          .attr({fill:rgb, opacity: this._imageParams.motifOpacity, 'stroke-opacity':0 });

    }


    if ( motif.metadata            !== undefined &&
         motif.metadata.identifier !== undefined ) {
      motif.metadata.description = motif.metadata.identifier;
    } else if ( motif.text !== undefined ) {
      motif.metadata.description = motif.text;
    } else {
      motif.metadata.description = "motif, " + motif.start + " - " + motif.end;
    }

    var xo = this._imageParams.xOffset,
        yo = this._imageParams.yOffset;

    var area = { text:   motif.metadata.description,
                 type:   "motif",
                 start:  motif.aliStart || motif.start,
                 end:    motif.aliEnd   || motif.end,
                 color: color,
                 coords: [ xo + x,         yo + y,
                           xo + x + width, yo + y + height ] };
    this._areasList.push( area );

    if ( motif.href !== undefined ) {
      area.href = motif.href;
    }

    this._buildTip( motif, glyph, 'motif');

  };

  this._drawSequence = function() {

    this._topOffset = Math.floor( this._baseline - ( this._seqHeight / 2 ) );
    this._botOffset = Math.floor( this._baseline + ( this._seqHeight / 2 ) + 1 );

    var seq_length = this._sequence.length * this._imageParams.residueWidth;

    var gradient = this._canvas.rect( 1, this._topOffset + 0.5, seq_length, ( this._seqHeight / 2 ) * 3 );
    gradient.attr({ 'fill': '270-#999-#eee:40-#ccc:60-#999', 'stroke': 'none' });

    var lengthLabel = this._canvas.text((this._sequence.length * this._imageParams.residueWidth) + 5, this._topOffset + (this._seqHeight / 2), this._sequence.length);
    lengthLabel.attr({'text-anchor': 'start'});

    // now that we have a label, we are going to have to resize the canvas to fit it on.
    var labelWidth = lengthLabel.getBBox().width;
    this._labelWidth = labelWidth;
    this._canvas.setSize( this._canvasWidth + labelWidth, this._canvasHeight );



    var xo = this._imageParams.xOffset,
        yo = this._imageParams.yOffset;

    return { label:  "sequence",
             text:   "sequence",
             coords: [ xo,                    yo + this._topOffset,
                       xo + this._imageWidth, yo + this._topOffset + this._seqStep * 5 ] };
  };
}

