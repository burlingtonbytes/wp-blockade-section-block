/*
	Plugin Name: Blockade Section Block
	Plugin URI: http://www.burlingtonbytes.com
	Author: Burlington Bytes
	Author URI: http://www.burlingtonbytes.com
	Version: 1.0.0
*/
// this line registers the plugin with TinyMCE. replace section_block with a unique identifier
tinymce.PluginManager.add( 'section_block', function( editor, url ) {
	// kill if older than IE8
	if ( !window.NodeList ) { return; }
	// localize blockade object
	var blockade = editor.plugins.blockade;
	// kill if blockade isn't loaded
	if( !blockade ) { return; }

	// add any necessary custom css to the editor
	editor.contentCSS.push( url + '/editorstyles.css' );

	// define heading types for later use in select box
	var heading_types = {
		'H1' : 'Heading 1',
		'H2' : 'Heading 2',
		'H3' : 'Heading 3',
		'H4' : 'Heading 4',
		'H5' : 'Heading 5',
		'H6' : 'Heading 6',
	};

	// create menu item
	var menu_item = {
		// set the text for the menu item
		text: 'Section (Custom Block)',
		onclick: function() {
			// check if we can add a block at all
			if( blockade.isPlaceable( blockade.body ) ) {
				// create an element to become our new block
				var el = blockade.document.createElement( 'div' );
				// now we need to give it a type that we will define later in contenttypes
				blockade.setData( el, blockade.datafields.type, 'section' );
				// lets build the contents of our block (we're gonna use a helper, just for clarity)
				var el = build_block_contents( el, 'H2', "Heading", "" );
				// now we convert the element to a Blockade Block
				var el = blockade.convertToBlock( el );
				// and drop it into the editor
				blockade.placeBlock( el );
				// always deselect any active editors
				blockade.removeActiveEditor();
				// open the options screen so further configuration can be done
				blockade.editor.fire( blockade.events.options, { target: el } );
			}
		}
	};
	// add the menu item to the submenu "Structural Blocks"
	blockade.addToMenu( menu_item, 'Structural Blocks' );

	// register options functionality... note the slug "section", as above
	blockade.contenttypes['section'] = {
		// this is the name that shows in the Block's control bar and in the
		// options panel
		name : "Section (Custom Block)",
		// this function is called when the options button is clicked, to grab
		// data from the block
		parse_block_data : function( data, block ) {
			// parse the important data from the block and store it to an object
			var heading = block.querySelector( '.wp-blockade-section-heading' );
			data.type_specific = {
				heading_type    : heading.tagName,
			};
			return data;
		},
		// this function is fired to render the options panel. it either returns
		// a string of HTML to populate a single tab, or it returns an object,
		// with named attributes representing a set of tabs to add to the
		// interface.
		render_html : function( data ) {
			// render the options for this block (in this case a single selectbox)
			var str = blockade.options_make_select_box_html( 'Heading Type', 'heading_type', heading_types, data.type_specific.heading_type );
			return str;
		},
		// this function is called when the options panel is saved, to modify
		// the block in question
		apply_form_results : function( data, form_data, block ) {
			// change the contents of the block, based on the option change
			var heading = block.querySelector( '.wp-blockade-section-heading' );
			heading.tagName = form_data.heading_type;
		}
	};

	// HELPER FUNCTION: populate our custom block
	function build_block_contents( el, heading_type, heading_content, body_content ) {
		// first, wipe the existing content
		el.innerHTML = "";
		// then create a heading
		var heading = blockade.document.createElement( heading_type );
		// make the heading an editable area
		blockade.setRole( heading, blockade.roles.editarea );
		// give it a class so we can select it later
		blockade.addClass( heading, 'wp-blockade-section-heading' );
		// populate it with the content
		heading.innerHTML = heading_content;
		// add it to our element
		el.appendChild(heading);
		// then create the section body
		var body = blockade.document.createElement( 'div' );
		// make the body a container
		blockade.setRole( body, blockade.roles.container );
		// give it a class so we can select it later
		blockade.addClass( body, 'wp-blockade-section-body' );
		// populate it with the content
		body.innerHTML = body_content;
		// add it to our element
		el.appendChild( body );
		// then return
		return el;
	};
});
