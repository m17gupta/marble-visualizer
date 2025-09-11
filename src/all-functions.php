<?php
/*
=== Load parent Styles ===
*/
function dc_enqueue_styles()
{
    wp_enqueue_style(
        "divi-parent",
        get_template_directory_uri() . "/style.css"
    );
    wp_enqueue_style(
        "child-style",
        get_stylesheet_directory_uri() . "/style.css",
        ["divi-parent"]
    );
    wp_enqueue_style("radar-style", "https://js.radar.com/v4.4.3/radar.css");
}
add_action("wp_enqueue_scripts", "dc_enqueue_styles");

function enqueue_radar_scripts()
{
    wp_enqueue_script(
        "radar-js",
        "https://js.radar.com/v4.4.3/radar.min.js",
        [],
        null,
        true
    );

    wp_add_inline_script(
        "radar-js",
        'Radar.initialize("prj_test_pk_72323f4294791dcc7e0031fa05c0cf6ef6c6df97");',
        "after"
    );
}
add_action("wp_enqueue_scripts", "enqueue_radar_scripts");

function register_restaurant_post_type()
{
    $labels = [
        "name" => "Restaurants",
        "singular_name" => "Restaurant",
        "menu_name" => "Restaurants",
        "name_admin_bar" => "Restaurant",
        "add_new" => "Add New",
        "add_new_item" => "Add New Restaurant",
        "new_item" => "New Restaurant",
        "edit_item" => "Edit Restaurant",
        "view_item" => "View Restaurant",
        "all_items" => "All Restaurants",
        "search_items" => "Search Restaurants",
        "not_found" => "No restaurants found.",
        "not_found_in_trash" => "No restaurants found in Trash.",
    ];

    $args = [
        "labels" => $labels,
        "public" => true,
        "has_archive" => true,
        "show_ui" => true,
        "show_in_menu" => true,
        "menu_position" => 5,
        "menu_icon" => "dashicons-store",
        "supports" => ["title", "editor", "thumbnail", "custom-fields"],
        "rewrite" => ["slug" => "location", "with_front" => false],
    ];

    register_post_type("restaurant", $args);
}
add_action("init", "register_restaurant_post_type");

function restaurant_locations_shortcode()
{
    $args = [
        "post_type" => "restaurant",
        "posts_per_page" => -1,
    ];

    $query = new WP_Query($args);
    $locations = [];

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $lat = get_post_meta(get_the_ID(), "latitude", true);
            $lng = get_post_meta(get_the_ID(), "longitude", true);
            $name = get_the_title();
            $addr = get_post_meta(get_the_ID(), "address", true);
            $city = get_post_meta(get_the_ID(), "city", true);
            $state = get_post_meta(get_the_ID(), "state", true);
            $zip = get_post_meta(get_the_ID(), "zip_code", true);
            $order_online_url = get_post_meta(
                get_the_ID(),
                "order_online_url",
                true
            );
            $view_local_menu = get_post_meta(
                get_the_ID(),
                "view_local_menu",
                true
            );
            $save_your_seat = get_post_meta(
                get_the_ID(),
                "save_your_seat",
                true
            );
            $permalink = get_permalink(get_the_ID());
            $full_address = trim("{$addr}, {$city}, {$state} {$zip}");
            if ($lat && $lng) {
                $locations[] = [
                    "name" => $name,
                    "lat" => floatval($lat),
                    "lng" => floatval($lng),
                    "addr" => $addr,
                    "address" => $full_address,
                    "city" => $city,
                    "state" => $state,
                    "zip" => $zip,
                    "permalink" => $permalink,
                    "order_online_url" => $order_online_url,
                    "view_local_menu" => $view_local_menu,
                    "save_your_seat" => $save_your_seat,
                ];
            }
        }
        wp_reset_postdata();
    }

    ob_start();
    ?>

   

    <div id="restaurant-container1">
        <div id="restaurant-list1">
            <h3>Our Locations</h3>
			<div class="tabs">
                <div class="tab1" data-tab="alllist">ALL</div>
                <div class="tab1 active" data-tab="nearbyList">NEARBY</div>
                <div class="tab1" data-tab="recentList">RECENT</div>
                <div class="tab1" data-tab="searchList">SEARCH</div>
            </div>
			<div id="alllist" class="tab-content1">
                <ul id="list-all" class="list"></ul>
            </div>
            <div id="nearbyList" class="tab-content1 active">
                <ul id="list-nearby" class="list"></ul>
            </div>
            <div id="recentList" class="tab-content1">
                <ul id="list-recent" class="list"></ul>
            </div>
            <div id="searchList" class="tab-content1">
                <input type="text" id="box-search" placeholder="Search for a location..." onkeyup="getLatLongFromAddress1(this.value)">
                <ul id="results-search" class="list"></ul>				
            </div>
        </div>
        <div id="map1"></div>
    </div>
  

    <script>
		var map1;
			function loadMap1(llat,llong){					
					map1 = Radar.ui.map({
						container: 'map1',
						style: '28d1aa3b-f72e-4c0b-82e4-0e112882b546',
						center: [llong,llat],
						zoom: 10,
					});			
					addMarkers1();

				}

			
			function addMarkers1() {
        allLocations.forEach(location => {
            let marker1 = Radar.ui.marker({ url: 'https://urbanegg.flywheelstaging.com/wp-content/uploads/2025/04/maps-and-flags.png',width:'48px',height:'48px'  })
                .setLngLat([location.lng, location.lat])
                .addTo(map1);				
            let popup1 = Radar.ui.popup({
  html: `
    <div class="loc-lits">
      <h4 class="loc-title">
        <a href="javascript:void(0);">${location.name}</a>
      </h4>
      <p class="loc-content">${location.address}</p>
      <div class="loc-list-btn">
        ${location.view_local_menu ? `<span><a href="${location.view_local_menu}" target="_blank">VIEW MENU</a></span>` : ''}
        ${location.order_online_url ? `<span><a href="${location.order_online_url}" target="_blank">BOOK YOUR TABLE</a></span>` : ''}
        ${location.save_your_seat ? `<span><a href="${location.save_your_seat}" target="_blank">SAVE YOUR PLACE</a></span>` : ''}
      </div>
    </div>
  `
});

            marker1.setPopup(popup1);
        });
    }
		
		// Center set karne ke liye
function setMapCenter(lng, lat, zoomIn) {
    map.setCenter([parseFloat(lng), parseFloat(lat)]);
    map.setZoom(zoomIn ? 10 : 7);
}
		
		// Cookie se number nikalna
function getCookieNum(name) {
    return parseFloat(getCookie(name) || 0);
}


		
		setTimeout(function(){
			
			allRes('list-all');
			showNearbyLocations("list-nearby",getCookie('restroLat'), getCookie('restroLng'));
			loadMap1(getCookie('restroLat'), getCookie('restroLng'));
		},5000);	
		
		function getLatLongFromAddress1(address) {
			const apiKey = "prj_test_pk_72323f4294791dcc7e0031fa05c0cf6ef6c6df97"; // Use your API key
			const encodedAddress = encodeURIComponent(address);
			const url = `https://api.radar.io/v1/geocode/forward?query=${encodedAddress}&layers=postalCode%2Cstate%2Clocality`;

			fetch(url, {
				method: "GET",
				headers: {
					"Authorization": apiKey
				}
			})
			.then(response => response.json())
			.then(data => {			
				if (data && data.addresses && data.addresses.length > 0) {
					const loca = data.addresses[0];

					searchLoc(loca.latitude, loca.longitude); // Call your function
				} else {
					console.log("No results found for this address.");
				}
			})
			.catch(error => {
				console.error("Error fetching data:", error);
			});
		}
		function searchLoc(seaLat,seaLong) {
			const query1 = document.getElementById("box-search").value.toLowerCase();
			if (query1.length === 0) return;
			console.log("search res start");
			showNearbyLocations("results-search", seaLat, seaLong);
			console.log("search res end");
		}
	</script>

    <style>
		#restaurant-list1 { 
			background-image:linear-gradient(180deg,rgba(129,87,164,0.22) 2%,rgba(129,87,164,0.85) 100%),url(<?php echo get_site_url() .
       "/wp-content/uploads/2025/08/DarkPurpleMural-scaled.webp"; ?>);
			
			 height: calc(100vh - 170px);
                overflow: auto;
			    padding-top: 3vw;
				padding-right: 60px;
				padding-bottom: 2vw;
				padding-left: 60px;
			    background-position: left center !important;
			    background-size: cover !important;
                background-repeat: no-repeat !important;
			
		}
		
		#restaurant-list1 h3{
			    font-weight: 700;
    text-transform: uppercase;
    font-size: 55px;
    color: #FFE941 !important;
    line-height: 1.4em;
			font-family:"sofia-pro-condensed",sans-serif!important;
		}
		.location-title{
				font-family:"sofia-pro-condensed",sans-serif!important;
			padding-bottom:0px;
			    line-height: 14px;
		}
		.location-list-btn span a{
			font-family:"sofia-pro-condensed",sans-serif!important;
			text-decoration:none;
		}
		.location-content{
				font-family:"sofia-pro-condensed",sans-serif!important;
			font-size:15px !important;
			font-weight:500 !important;
		}
		.location-title a:hover{
			color:#fff !important;
		}
		
		.tab1{
			font-size:18px !important;
		}
		
		
        
    </style>

    <?php return ob_get_clean();
}
add_shortcode("restaurant_locations", "restaurant_locations_shortcode");

function restaurant_map_shortcode()
{
    global $post;

    // Get lat/lng values from post meta
    $latitude = get_post_meta($post->ID, "latitude", true);
    $longitude = get_post_meta($post->ID, "longitude", true);

    // Check if both lat and lng exist
    if (!$latitude || !$longitude) {
        return "<p>Location not available.</p>";
    }

    // Build iframe map
    $iframe =
        '<iframe
        width="100%" 
        height="550" 
        style="border:0;" 
        loading="lazy" 
        allowfullscreen 
        referrerpolicy="no-referrer-when-downgrade" 
        src="https://www.google.com/maps?q=' .
        esc_attr($latitude) .
        "," .
        esc_attr($longitude) .
        '&z=10&output=embed">
    </iframe>';

    return $iframe;
}
add_shortcode("restaurant_map", "restaurant_map_shortcode");

function restaurant_map_shortcode_with_popup()
{
    ob_start(); ?>   
    <div class="popup-maker">
	<div id="restaurant-container" class="show-flex">
		
        <div id="restaurant-list1">
            <h3>Select a Location</h3>
            <div class="tabs">
                <div class="tab" data-tab="all">ALL</div>
                <div class="tab active" data-tab="nearby">NEARBY</div>
                <div class="tab" data-tab="recent">RECENT</div>
                <div class="tab" data-tab="search">SEARCH</div>
            </div>
            <div id="all" class="tab-content">
                <ul id="all-list" class="list"></ul>
            </div>
            <div id="nearby" class="tab-content active">
                <ul id="nearby-list" class="list"></ul>
            </div>
            <div id="recent" class="tab-content">
                <ul id="recent-list" class="list"></ul>
            </div>
            <div id="search" class="tab-content">
                <input type="text" id="search-box" placeholder="Search for a location..." onkeyup="getLatLongFromAddress(this.value)">
                <ul id="search-results" class="list"></ul>
				
            </div>
			<div class="select-address-btn">
				<button id="select-location-btn" class="et_pb_button" >
					Select
				</button>
			</div>			
        </div>
        <!-- Map -->
        <div class="map-container">
            <div id="rmap" style="width: 100%; height: 100%;"></div>
        </div>
    </div>
</div>
<style>	
	#restaurant-list {    
    	background-image: url(<?php echo get_site_url() .
         "/wp-content/uploads/2025/08/DarkPurpleMural-scaled.webp"; ?>);   
    }
</style>
<?php
}
add_shortcode("restaurant_map_popup", "restaurant_map_shortcode_with_popup");
//add_action('wp_footer', 'restaurant_map_shortcode_with_popup');

function get_all_restaurants_ajax()
{
    $args = [
        "post_type" => "restaurant",
        "posts_per_page" => -1,
    ];

    $query = new WP_Query($args);
    $restaurants = [];

    if ($query->have_posts()):
        while ($query->have_posts()):
            $query->the_post();
            $address = get_post_meta(get_the_ID(), "address", true);
            $city = get_post_meta(get_the_ID(), "city", true);
            $state = get_post_meta(get_the_ID(), "state", true);
            $zip = get_post_meta(get_the_ID(), "zip_code", true);
            $weekdays_html = get_post_meta(
                get_the_ID(),
                "weekdays_opening_time",
                true
            );
            $weekends_html = get_post_meta(
                get_the_ID(),
                "weekends_opening_time",
                true
            );

            $weekdays_clean = strip_tags($weekdays_html);
            $weekends_clean = strip_tags($weekends_html);
            $full_address = trim("{$address}, {$city}, {$state} {$zip}");
            $restaurants[] = [
                "id" => get_the_ID(),
                "name" => get_the_title(),
                "address" => $full_address,
                "city" => get_post_meta(get_the_ID(), "city", true),
                "state" => get_post_meta(get_the_ID(), "state", true),
                "zip" => get_post_meta(get_the_ID(), "zip_code", true),
                "lat" => get_post_meta(get_the_ID(), "latitude", true),
                "lng" => get_post_meta(get_the_ID(), "longitude", true),
                "order_online_url" => get_post_meta(
                    get_the_ID(),
                    "order_online_url",
                    true
                ),
                "view_local_menu" => get_post_meta(
                    get_the_ID(),
                    "view_local_menu",
                    true
                ),
                "save_your_seat" => get_post_meta(
                    get_the_ID(),
                    "save_your_seat",
                    true
                ),
                "weekdays_html" => $weekdays_clean,
                "weekends_html" => $weekends_clean,
                "permalink" => get_permalink(get_the_ID()),
            ];
        endwhile;
        wp_reset_postdata();
    endif;

    wp_send_json($restaurants);
}
add_action("wp_ajax_get_all_restaurants", "get_all_restaurants_ajax");
add_action("wp_ajax_nopriv_get_all_restaurants", "get_all_restaurants_ajax");

function allScriptsNeedsInFooter()
{
    ?>
	<script>
		var allLocations = [];
let map;
let userLocation = [28.6139, 77.2090]; // default Delhi (lat, lng)
		
		var recentSearches = [];
    	var searchLat; 
    	var searchLong;  
		function toRadians(degrees) {
			return degrees * (Math.PI / 180);
		}
		function haversine(lat1, lon1, lat2, lon2) {
			const R = 6371; // Radius of Earth in kilometers

			// Convert degrees to radians
			const lat1Rad = toRadians(lat1);
			const lon1Rad = toRadians(lon1);
			const lat2Rad = toRadians(lat2);
			const lon2Rad = toRadians(lon2);

			// Differences between the latitudes and longitudes
			const dlat = lat2Rad - lat1Rad;
			const dlon = lon2Rad - lon1Rad;
			

			// Haversine formula
			const a = Math.sin(dlat / 2) * Math.sin(dlat / 2) +
						Math.cos(lat1Rad) * Math.cos(lat2Rad) *
						Math.sin(dlon / 2) * Math.sin(dlon / 2);
			const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

			// Distance in kilometers
			return R * c;
		}
		function filterLocations(locs, targetLat, targetLon, radius = 40) {
			return locs
				.map(loc => {
					const distance = haversine(targetLat, targetLon, loc.lat, loc.lng);
					console.log(distance,'distance');
					return { ...loc, distance: parseFloat(distance.toFixed(2)) }; // Round distance to 2 decimal places
				})
				.filter(loc => loc.distance <= radius)
				.sort((a, b) => a.distance - b.distance); // Sort by distance ASC
		}
		
		
		function locationHtmlView(locName,distance,address,localMenuUrl,orderOnlineUrl,saveSeatUrl,divId,permalink){
			if(divId.startsWith('list-')) {				
				var locationURL = permalink;				
			}else{
				var locationURL = "javascript:void(0);";
			}
			return '<span><img src="<?php echo get_site_url() .
       "/wp-content/uploads/2025/09/location.png"; ?>" width="50" height="50" alt="location"  /></span><div class="location-lits"><h4 class="location-title"><a href="'+locationURL+'">'+locName+'</a> <span class="miles-val"> ('+distance+' miles)</span></h4><p class="location-content zoom-map">'+address+'</p><div class="location-list-btn"><span><a href="'+localMenuUrl+'" target="_blank">VIEW MENU</a></span><span><a href="'+orderOnlineUrl+'" target="_blank">BOOK YOUR TABLE</a></span><span><a href="'+saveSeatUrl+'" target="_blank">SAVE YOUR PLACE</a></span></div></div>'
		}
		
		function fetchRestaurants() {
			fetch('<?php echo admin_url("admin-ajax.php"); ?>', {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: 'action=get_all_restaurants'
			})
			.then(res => res.json())
			.then(data => {
				console.log(data);
				allLocations = data.map(item => ({
					id: parseFloat(item.id),
					lat: parseFloat(item.lat),
					lng: parseFloat(item.lng),
					name: item.name,
					address: item.address,
					order_online_url: item.order_online_url,
					view_local_menu: item.view_local_menu,
					save_your_seat: item.save_your_seat,
					permalink: item.permalink			

				}));
			})
			.catch(err => console.log('Error:', err));
		}
		fetchRestaurants();
		navigator.permissions.query({ name: "geolocation" }).then(function (result) {			
			if (result.state === "prompt") {
				navigator.geolocation.getCurrentPosition(position => {
					userLocation = [position.coords.longitude, position.coords.latitude]; 
					loadMap(rlat='',rlong='','rmap');					
					allRes('all-list');
					//alert(userLocation[1]);
					//alert(userLocation[0]);
					showNearbyLocations("nearby-list",userLocation[1], userLocation[0]);					
					const nearbyRestro = filterLocations(allLocations, userLocation[1], userLocation[0], 40);
					console.log(nearbyRestro,'nearbyrestro');
					if (nearbyRestro.length) {
						console.log("step1");
						document.querySelector("#popmake-25959296 h1 span").textContent = nearbyRestro[0].name;
						//deleteCookie('restroName');
						setCookie('restroName',nearbyRestro[0].name);
						setCookie('restroLat',nearbyRestro[0].lat);
						setCookie('restroLng',nearbyRestro[0].lng);
					}else{
						console.log("step2");
						document.querySelector("#popmake-25959296 h1 span").textContent = getCookie('restroName') ?? 'Loading...';
					}
					console.log("hiii");
					//document.getElementById("popmake-25959296").click();
					console.log("hiii11111");
				}, error => {
					console.error("Error getting location:", error);
				});
			}else{
				if(getCookie('restroName')!=''){
					document.querySelector("#popmake-25959296 h1 span").textContent = getCookie('restroName') ?? 'Loading...';
				}else{
					document.querySelector("#popmake-25959296 h1 span").textContent = 'Loading...';
				}
			}
			
		});
		
		function loadMap(rlat='',rlong='',containerId='rmap'){				
			if(rlat && rlong){
				userLocation = [rlong,rlat];
			}
			map = Radar.ui.map({
				container: 'rmap',
				style: '28d1aa3b-f72e-4c0b-82e4-0e112882b546',
				center: userLocation,
				zoom: 10,
			});			
			addMarkers();
			
		}

    function addMarkers() {
        allLocations.forEach(location => {
            let marker = Radar.ui.marker({ url: 'https://urbanegg.flywheelstaging.com/wp-content/uploads/2025/04/maps-and-flags.png',width:'48px',height:'48px'  })
                .setLngLat([location.lng, location.lat])
                .addTo(map);				
            let popup = Radar.ui.popup({
  html: `
    <div class="loc-lits">
      <h4 class="loc-title">
        <a href="javascript:void(0);">${location.name}</a>
      </h4>
      <p class="loc-content">${location.address}</p>
      <div class="loc-list-btn">
        ${location.view_local_menu ? `<span><a href="${location.view_local_menu}" target="_blank">VIEW MENU 1</a></span>` : ''}
        ${location.order_online_url ? `<span><a href="${location.order_online_url}" target="_blank">BOOK YOUR TABLE</a></span>` : ''}
        ${location.save_your_seat ? `<span><a href="${location.save_your_seat}" target="_blank">SAVE YOUR PLACE</a></span>` : ''}
      </div>
    </div>
  `
});

            marker.setPopup(popup);
        });
    }
	function setCookie(name,val) {
		document.cookie = ""+name+"=" + val + "; path=/";
	}	
	function getCookie(name) {
		const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
		return match ? match[2] : null;
	}
	function deleteCookie(name) {
		document.cookie = name + "=;";
	}
	function decodeHtml(html) {
		const txt = document.createElement('textarea');
		txt.innerHTML = html;
		return txt.value;
	}	
		
	document.getElementById("popmake-25959296").addEventListener("click", function() {
		document.getElementById("select-location-btn").classList.remove("show");
		setTimeout(function(){			
			let latValue = document.getElementById("popmake-25959296").getAttribute("data-lat");
			let longValue = document.getElementById("popmake-25959296").getAttribute("data-long");	
			console.log(latValue,"ffff1111");
			if(latValue && longValue){
			 loadMap(latValue,longValue,'rmap');
			}else{
				latValue = getCookie('restroLat');
				longValue = getCookie('restroLng');
				loadMap(getCookie('restroLat'),getCookie('restroLng'),'rmap');
			}
			allRes('all-list');
			showNearbyLocations("nearby-list",latValue, longValue);
			console.log("ffff");
		},200);
   	 	
    });
	
	document.getElementById("select-location-btn").addEventListener("click", function() {
		setTimeout(function(){
			let locName = document.getElementById("select-location-btn").getAttribute("data-loc");
			let resId = document.getElementById("select-location-btn").getAttribute("data-res");
			let latValue = document.getElementById("select-location-btn").getAttribute("data-lat");
			let longValue = document.getElementById("select-location-btn").getAttribute("data-long");			
			setCookie('restroName',locName);
			setCookie('restroLat',latValue);
			setCookie('restroLng',longValue);
			document.querySelector("#popmake-25959296 h1 span").textContent = locName;
			document.getElementById("popmake-25959296").setAttribute("data-res", resId);
			document.getElementById("popmake-25959296").setAttribute("data-lat", latValue);
			document.getElementById("popmake-25959296").setAttribute("data-long", longValue);
			document.querySelector(".popmake-close").click();
		},50);
   	 	
    });	
	
	document.querySelectorAll(".tab").forEach(tab => {
        tab.addEventListener("click", () => {
            document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
            document.querySelectorAll(".tab-content").forEach(tc => tc.classList.remove("active"));

            tab.classList.add("active");
            document.getElementById(tab.getAttribute("data-tab")).classList.add("active");
        });
    });
	
	document.querySelectorAll(".tab1").forEach(tab1 => {
        tab1.addEventListener("click", () => {
            document.querySelectorAll(".tab1").forEach(t => t.classList.remove("active"));
            document.querySelectorAll(".tab-content1").forEach(tc => tc.classList.remove("active"));

            tab1.classList.add("active");
            document.getElementById(tab1.getAttribute("data-tab")).classList.add("active");
        });
    });	
		
		
	function getLatLongFromAddress(address) {
        const apiKey = "prj_test_pk_72323f4294791dcc7e0031fa05c0cf6ef6c6df97"; // Use your API key
        const encodedAddress = encodeURIComponent(address);
        const url = `https://api.radar.io/v1/geocode/forward?query=${encodedAddress}&layers=postalCode%2Cstate%2Clocality`;
        
        fetch(url, {
            method: "GET",
            headers: {
                "Authorization": apiKey
            }
        })
        .then(response => response.json())
        .then(data => {			
            if (data && data.addresses && data.addresses.length > 0) {
                const loca = data.addresses[0];
                              
                searchLocations(loca.latitude, loca.longitude); // Call your function
            } else {
                console.log("No results found for this address.");
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
    }
	function getCityFromLatLong(lat, lon) {
		const apiKey = "prj_test_pk_72323f4294791dcc7e0031fa05c0cf6ef6c6df97";  
		// Construct the URL for the reverse geocoding API
		const url = `https://api.radar.io/v1/geocode/reverse?coordinates=${lat},${lon}&layers=locality`;
		// Make the reverse geocoding request to Radar API
		fetch(url, {
			method: "GET",
			headers: {
				"Authorization": apiKey  // Your API key without "Bearer" prefix
			}
		})
			.then(response => response.json())  // Parse the JSON response
			.then(data => {
			if (data && data.addresses && data.addresses.length > 0) {
				// Extract city name from the response
				const cityName = data.addresses[0].city;
				const country = data.addresses[0].country;
				const formattedAddress = data.addresses[0].formattedAddress;

				// You can return or use the city here
				return cityName; // For further processing, you can return the city or handle it here
			} else {
				console.log("No city found for these coordinates.");
			}
		})
			.catch(error => {
			console.error("Error fetching data from Radar API:", error);
		});
	}
		
	function allRes(divId) {
		const nearbyList = document.getElementById(divId);
		nearbyList.innerHTML = ""; 

		const restroLat = getCookieNum('restroLat');
		const restroLng = getCookieNum('restroLng');

		const locationsWithDistance = allLocations.map(location => {
			const distance = haversine(restroLat, restroLng, location.lat, location.lng);
			return { ...location, distance: parseFloat(distance.toFixed(2)) };
		});

		locationsWithDistance.sort((a, b) => a.distance - b.distance);

		// locationsWithDistance.forEach(location => {
		// 	const li = document.createElement("li");
		// 	li.className = "location-item";
		// 	li.innerHTML = `
		// 		<h4>${location.name}</h4>
		// 		<p>${location.address}</p>
		// 		<p><strong>Distance:</strong> ${location.distance} km</p>
		// 	`;
		// 	li.addEventListener("click", () => {
		// 		setCookie('restroLat', location.lat);
		// 		setCookie('restroLng', location.lng);
		// 		setMapCenter(location.lng, location.lat, true);
		// 	});
		// 	nearbyList.appendChild(li);
		// });

		nearbyLocations.forEach(location => {
			const li = document.createElement("li");
			li.classList.add("loc-list");
			li.classList.add("loc_"+location.id);
			li.setAttribute("data-lat", location.lat);
			li.setAttribute("id", location.id);
			li.setAttribute("data-lng", location.lng);
			li.innerHTML = locationHtmlView(location.name, location.distance, location.address, location.view_local_menu, location.order_online_url, location.save_your_seat,divId,location.permalink);	
            li.onclick = () => {				
                focusOnLocation(location, divId, true);
				if(divId.startsWith('list-')) {
					addRecentSearch(location,'list-recent');
				}else{
					addRecentSearch(location,'recent-list');
				}
                
            };
            nearbyList.appendChild(li);
        });
	}

// ✅ Geolocation fix
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        userLocation = [
            position.coords.latitude,
            position.coords.longitude
        ];
        setCookie('restroLat', userLocation[0]);
        setCookie('restroLng', userLocation[1]);
        loadMap(userLocation[0], userLocation[1]); // default map load
    });
}

		
    
    function showNearbyLocations(divId, targetLat, targetLon, Radius = 100000) {
        const nearbyList = document.getElementById(divId);
        const nearbyLocations = filterLocations(allLocations, targetLat, targetLon, Radius);  
        nearbyList.innerHTML = ""; 
        nearbyLocations.forEach(location => {
			const li = document.createElement("li");
			li.classList.add("loc-list");
			li.classList.add("loc_"+location.id);
			li.setAttribute("data-lat", location.lat);
			li.setAttribute("id", location.id);
			li.setAttribute("data-lng", location.lng);
			li.innerHTML = locationHtmlView(location.name, location.distance, location.address, location.view_local_menu, location.order_online_url, location.save_your_seat,divId,location.permalink);	
            li.onclick = () => {				
                focusOnLocation(location, divId, true);
				if(divId.startsWith('list-')) {
					addRecentSearch(location,'list-recent');
				}else{
					addRecentSearch(location,'recent-list');
				}
                
            };
            nearbyList.appendChild(li);
        });
    }
    function searchLocations(seaLat,seaLong) {
        const query = document.getElementById("search-box").value.toLowerCase();
        if (query.length === 0) return;       
        showNearbyLocations("search-results", seaLat, seaLong);	
    }

    function focusOnLocation(location, divId, zoomIn) {
		document.querySelectorAll(".loc-list").forEach(t => t.classList.remove("active"));
		document.querySelectorAll(".loc_" + String(location.id)).forEach(t => t.classList.add("active"));
		
		document.getElementById("select-location-btn").textContent = "Select "+decodeHtml(location.name);
		document.getElementById("select-location-btn").setAttribute("data-loc", decodeHtml(location.name));
		document.getElementById("select-location-btn").setAttribute("data-res", location.id);
		document.getElementById("select-location-btn").setAttribute("data-lat", location.lat);
		document.getElementById("select-location-btn").setAttribute("data-long", location.lng);
		document.getElementById("select-location-btn").classList.add("show");
		if(divId.startsWith('list-') || divId.startsWith('results-')) {
			setMapCenter(location.lng,location.lat,zoomIn);
		}else{
        	map.setCenter([location.lng, location.lat]);
        	map.setZoom(zoomIn ? 10 : 7);
		}
		
		
    }

    function addRecentSearch(location,divId) {
		console.log(recentSearches,'recentSearches');
        if (!recentSearches.some(loc => loc.name === location.name)) {
            recentSearches.unshift(location);
            if (recentSearches.length > 5) recentSearches.pop();
        }
		console.log(recentSearches,'recentSearches1111');
        updateRecentList(divId);
    }

    function updateRecentList(divId) {
        const recentList = document.getElementById(divId);
        recentList.innerHTML = "";
        recentSearches.forEach(location => {			
            const li = document.createElement("li");
			li.classList.add("loc-list"); 
			li.classList.add("loc_"+location.id);
			li.setAttribute("data-lat", location.lat);
			li.setAttribute("data-lat", location.lng);
			li.innerHTML = locationHtmlView(location.name, location.distance, location.address, location.view_local_menu, location.order_online_url, location.save_your_seat,divId,location.permalink);	
            li.onclick = () => {
                focusOnLocation(location, divId,true);
              
            };         
            recentList.appendChild(li);
           
        });
    }	
	</script>	
<?php
}
add_action("wp_footer", "allScriptsNeedsInFooter");
