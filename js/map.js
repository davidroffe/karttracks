gMap = {
        init: function() {
          var mapOptions = {
              center: {lat: 38.12, lng: -98.209907},
              zoom: 5,
              panControl: false,
              scrollwheel: false,
              streetViewControl: false,
              mapTypeControl: false,
              styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#a6b6bc"},{"visibility":"on"}]}],
              mapTypeId: google.maps.MapTypeId.ROADMAP
          };
          this.map = new google.maps.Map(document.getElementById('map-canvas'),
              mapOptions);

          this.customOverlay.prototype = new google.maps.OverlayView();
          this.customOverlay.prototype.onAdd = function(){
              

              var panes = this.getPanes();

              panes.floatPane.appendChild(this.container);
          };

          this.customOverlay.prototype.draw = function() {
              var overlayProjection = this.getProjection();
              var position = overlayProjection.fromLatLngToDivPixel(this.marker.getPosition());
              this.container.style.top = position.y - this.container.offsetHeight - 45 + 'px';
              this.container.style.left = position.x - this.container.offsetWidth/2 + 'px';
          };

          this.customOverlay.prototype.onRemove = function() {
              this.container.parentNode.removeChild(this.container);
          };
					
					mapData = [
							{
									coord: {lat: 47.3233826, lng: -122.1499311},
									src: 'http://media-cdn.tripadvisor.com/media/photo-s/02/c6/b5/88/pacific-grand-prix.jpg',
									title: 'PGP Motorsports Park',
									address: '31003 144th Ave SE, Kent, WA 98042',
                  loc: 'Kent, WA',
									category: ['paved', 'sprint']
          		},
							{
									coord: {lat: 47.031666, lng: -122.378693},
									src: 'http://www.wordracing.com/images/kart-tracks/PSGKA.jpg',
									title: 'PSGKA',
                  address: '24716 Mountain Highway E Spanaway, WA 98387',
									loc: 'Spanaway, WA',
									category: ['paved', 'sprint']
							}
					];
					mapData.forEach(this.initMarkersAndInfo.bind(this));

          google.maps.event.addListener(this.map, 'click', function(){
              if(this.activeWindow) this.activeWindow.container.style.visibility = 'hidden';

              this.activeWindow = null;
          }.bind(this));
        },

        initMarkersAndInfo: function(content) {

          var marker = new google.maps.Marker({
              position: content.coord,
              map: this.map,
              title: content.title,
              icon: 'img/marker.png'
          });

          this.initInfoWindow(marker, content);
        },

        initInfoWindow: function(marker, content) {
          var myOverlay = new this.customOverlay(marker, content, this.map);

          google.maps.event.addListener(marker, 'click', function(){
              if(this.activeWindow) this.activeWindow.container.style.visibility = 'hidden';
              myOverlay.container.style.visibility = 'visible';

              var projection = myOverlay.getProjection();
              var position = projection.fromLatLngToDivPixel(marker.getPosition());
              position.y -= 150;
              this.map.panTo(projection.fromDivPixelToLatLng(position));
              
              this.activeWindow = myOverlay;
          }.bind(this));
          
        },

        customOverlay: function(marker, content, map){
            this.marker = marker;
            this.content = content;
            this.container = document.createElement('div');

            this.container.className = 'info-window';
            this.container.innerHTML = document.getElementById('template').innerHTML;
            this.container.getElementsByClassName('cat-1')[0].textContent = this.content.category[0];
            this.container.getElementsByClassName('cat-2')[0].textContent = this.content.category[1];
            this.container.getElementsByClassName('info-window-img')[0].src = this.content.src;
            this.container.getElementsByClassName('info-window-title')[0].textContent = this.content.title;
            this.container.getElementsByClassName('info-window-loc')[0].appendChild(document.createTextNode(this.content.loc));
            
            this.setMap(map);
            this.container.style.visibility = 'hidden';
        }
};
google.maps.event.addDomListener(window, 'load', gMap.init.bind(gMap));