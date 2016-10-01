$(function() {

	var $wndw = $(window),
		$html = $('html'),
		$body = $('body'),
		$both = $('body, html');


	String.prototype.capitalize = function() {
		 return this.charAt(0).toUpperCase() + this.slice(1);
	}



	//	Auto submenu
	var sections = [];
	var submenu = '';
	$('.submenutext')
		.each(
			function( i )
			{
				var $h = $(this).parent(),
					id = $h.attr( 'id' ) || 'h' + i;

				$h.attr( 'id', id );

				sections.push( '#' + id );
				submenu += '<li><a href="#' + id + '">' + $(this).text().capitalize() + '</a></li>';
			}
		);

	if ( submenu.length )
	{
		sections = sections.reverse();

		var $submenu = $('<div class="submenu"><div><ul>' + submenu + '</ul></div></div>')
			.insertAfter( 'h1' );
		
		var $subfixed = $submenu
			.clone()
			.addClass( 'fixed Fixed' )
			.insertAfter( $submenu );

		var fixed = false,
			start = $submenu.offset().top;

		$submenu
			.add( $subfixed )
			.find( 'a' )
			.on( 'click',
				function( e )
				{
					e.preventDefault();
					$both.animate({
						scrollTop: $($(this).attr( 'href' )).offset().top - 120
					});
				}
			);

		$wndw
			.on( 'scroll.submenu',
				function( e )
				{
					var offset = $wndw.scrollTop();
					if ( fixed )
					{
						if ( offset < start )
						{
							$body.removeClass( 'fixedsubmenu' );
							fixed = false;
						}
					}
					else
					{
						if ( offset >= start )
						{
							$body.addClass( 'fixedsubmenu' );
							fixed = true;
						}
					}
				}
			);

		var _selected = -1;
		var $subitems = $submenu
			.add( $subfixed )
			.find( 'li' );

		$wndw
			.on( 'scroll.submenu',
				function( e )
				{
					var offset = $wndw.scrollTop();
					for ( var s = 0; s < sections.length; s++ )
					{
						if ( $(sections[ s ]).offset().top < offset + 160 )
						{
							if ( _selected !== s )
							{
								_selected = s;
								$subitems
									.removeClass( 'selected' )
									.find( '[href="' + sections[ s ]+ '"]' )
									.parent()
									.addClass( 'selected' );
							}
							break;
						}
					}
				}
			);

		$wndw
			.trigger( 'scroll.submenu' );
	}



	//	The menu
	var API = $('#menu')
		.mmenu({
			extensions		: [ 'widescreen', 'theme-white', 'effect-menu-slide', 'pagedim-black' ],
			counters		: true,
			dividers		: {
				fixed 			: true
			},
			navbar 			: {
				title			: 'mmenu'
			},
			navbars			: [
				{
					position	: 'top',
					content 	: ['searchfield']
				}, {
					position	: 'top'
				}, {
					position	: 'bottom',
					content 	: ['<div>Hosted by <a href="https://www.byte.nl/" target="_blank">Byte</a></div>']
				}
			],
			searchfield		: {
				resultsPanel 	: true
			},
			setSelected		: {
				parent			: true
			}

		}, {
			searchfield		: {
				clear 			: true
			}

		})
		.data( 'mmenu' );

	$('#hamburger')
		.on( 'click',
			function( e )
			{
				e.preventDefault();
				if ( $html.hasClass( 'mm-opened' ) )
				{
					API.close();
				}
				else
				{
					API.open();
				}
			}
		);


});