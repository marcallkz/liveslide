//id confirm
if (!sessionStorage.liveID)
	sessionStorage.liveID = prompt('ID');

(function() {
	var conn = new WebSocket('ws://10.10.0.5:8080'),
		playpause = document.createElement('span'),
		wrapper = document.createElement('div'),
		live = true,
	    msg = { 
	    	src: sessionStorage.liveID,
	    	command: 0
	    };

	playpause.id = 'playpause';
	playpause.classList.add('pause');
	wrapper.classList.add('wrapper');
	wrapper.appendChild(playpause)
	document.body.appendChild(wrapper);

	playpause.addEventListener('click', function(e)
	{
		this.classList.toggle('pause');
		this.classList.toggle('play');
		live = !live; 
	});

	conn.onopen = function(e) {
		console.log('Connection established!');
	};

	conn.onerror = function(e) {
		console.log(e);
	};

	conn.onmessage = function(e) {
		var cmd = JSON.parse(e.data).command;
		if (live)
			Reveal.slide(cmd.h, cmd.v); //reveal js line. Chanfe if you're not using revealjs
	};

	//revealjs listener. Change if you're not using revealjs
	Reveal.addEventListener('slidechanged', function(event) {
		msg.command = {h: event.indexh, v: event.indexv};
		conn.send(JSON.stringify(msg));
	});
})();