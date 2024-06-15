async function sssim() {
	let boxes = [];
	let selected = null;
	
	const find_parent = (h, clname) => {
		while (h.parentElement) {
			h = h.parentElement;
			if (h.className.indexOf(clname) !== -1) return h;
		}
		
		return null;
	};
	
	const show_prev_images = (box, event) => {
		// Prevent multiple preview instances at once
		hide_all();
		
		if (box.PREVIEWS_FETCHED && box.container) {
			event = event || window.event; // IE-ism
						
			const c = box.container;
			c.style.display = 'block';
			
			const xy = c.getBoundingClientRect();
			
			//c.style.top  = `${event.clientY}px`;
			c.style.left = `${box.getBoundingClientRect().x-15}px`;
		}
	};
	
	const hide_all = () => {
		for (const b of boxes) {
			if (b.container && b.container.style.display === "block") {
				b.container.style.display = "none";
			}
		}
	};
	
	const hide_prev_images = (box) => {
		if (box.PREVIEWS_FETCHED && box.container) {
			box.container.style.display = 'none';
			return;
		}
	};
	
	let items = [...document.querySelectorAll('[onclick*="konyvjelzo("]')];
	for (const it of items) {
		let box = find_parent(it, 'box_torrent');
		if (!box) continue; // probably we can break it too
		
		boxes.push(box);
		box.onmouseenter = async (event) => {
			selected = box;
			
			if (box.PREVIEWS_FETCHED) {
				//show_prev_images(box, event);
				return;
			}
			
			box.PREVIEWS_FETCHED = true;
			box.container = document.createElement('div');
			box.container.style = "position:absolute;left:0;width:200px;min-height:300px;transform:translateX(-100%) translateY(-50%);background:#fff;padding:5px;border:2px solid #111;pointer-events:none;";
			box.container.style.display = "none";
			
			{
				const arrow = document.createElement('div');
				arrow.textContent = '<';
				arrow.style = 'position:absolute;left:100%;top:55%;transform: translateX(10px) translateY(-50%);color:#fff;font-weight:bold;';
				box.container.appendChild(arrow);
			}
			
			const s = it.getAttribute('onclick');
			let r = '';
			for (i = 0; i < s.length; i++) {
				if (s[i] <= '9' && s[i] >= '0') {
					r += s[i];
				}
			}
			
			let resp = await fetch('ajax.php?action=torrent_drop&id='+r);
			resp = await resp.text();
			let h = document.createElement('html');
			if (h) {
				h.innerHTML = resp;
				const links = [...h.querySelectorAll('.torrent_kep_ico a')];
				if (links.length) {
					for (let l of links) {
						let img = document.createElement("img");
						img.style = "width: 200px;";
						img.src = l.href;
						box.container.appendChild(img);
					}
					box.appendChild(box.container);

				} else {
					box.container = null;
				}
			}
		};
		
		box.onmouseleave = () => {
			selected = null;
			hide_prev_images(box);
		};

	}
	
	window.addEventListener("keydown", (event) => {
		if (event.key === "Shift" && selected) {
			show_prev_images(selected, event);
		}
	});
	
	window.addEventListener("keyup", (event) => {
		if (event.key == "Shift") {
			hide_all();
			return;
		}
	});
	
}
sssim();