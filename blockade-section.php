<?php if(!defined('ABSPATH')) { die(); } // Include in all php files, to prevent direct execution
// This php file is what registers the add-on's TinyMCE Plugin with WordPress, and enqueues any front end styles and scripts necessary.

/*
 * Block Name: Section Block
 * Slug: section_block
 * Author: Burlington Bytes
 * Author URI: http://www.burlingtonbytes.com
 * Description: Custom block for sections with headers (sample add-on with comments for developers)
 * Version: 1.0.0
 */
// NOTE: the WordPress comment block above is required for all Blockade add-ons (to remain compatible with future core features)
// NOTE: this add-on is written in a pattern called a Singleton Class, to limit the side effects it creates.
//       although not strictly required, we recommend using Singletons for all add-ons
// This if statement makes sure we don't declare the same add-on twice
if( !class_exists('BlockadeSectionBlock') ) { // replace BlockadeSectionBlock with your add-ons name
	class BlockadeSectionBlock { // replace BlockadeSectionBlock with your add-ons name
		private static $_this;
		private $addon_dir;
		private $addon_dir_url;

		// This is the core of the Singleton Pattern. you'll never need to modify this
		public static function Instance() {
			static $instance = null;
			if ($instance === null) {
				$instance = new self();
			}
			return $instance;
		}

		// in a Singleton, the private constructor is where all your code kicks off
		private function __construct() {
			// use this hook to enqueue styles and scripts necessary for rendering your add-on's output
			// add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_styles' ) );

			// use this hook to register your add-on's TinyMCE Plugin. change the priority to change the order of menu items in blockade
			// if you haven't used WordPress in an OOP environment before, the array below points the filter to the public function
			// register_tinymce_plugin, listed below. Since we are in a class, you do not need to rename this function for every add-on
			add_filter( 'wp-blockade-tinymce-plugins', array( $this, "register_tinymce_plugin" ), 15 );
		}
		// PUBLIC FUNCTIONS
		// This filter function adds your TinyMCE plugin to the list of plugins attached to the WordPress editor
		public function register_tinymce_plugin( $plugins ) {
			// this array key must be unique to this add-on, and you must provide the full url for the plugin file
			// this add-on is meant to live in the theme, so it uses theme directory functions
			// for release plugins, we highly recommend minifying the plugin file, but to simplify dev,
			// this example is left unminified
			$plugins['section_block'] = get_template_directory_uri() . '/blockade/section/plugin.js';
			return $plugins;
		}
	}
	// Instantiate the add-on, the Singleton way
	BlockadeSectionBlock::Instance(); // replace BlockadeSectionBlock with your add-ons name
}
