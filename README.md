<h1><strong>HTML Start Template:</strong> <br>Full-featured template for creating a modern layout of sites and e-mail.</h1>

<p>
	<img src="https://github.com/shamhaner/GULP/blob/master/src/img/_src/preview.png" alt="HTML Start Template">
</p>

<p>Author: <a href="http://https://xn--80aseleljd.xn--p1ai/" target="_blank">Prospection</a></p>
<p>E-mail: <a href="mailto:partner@phone-style.ru" target="_blank">partner@phone-style.ru</a></p>

<p>«HTML Start Template» is all-inclusive start HTML5 template with Bootstrap 4 (grid & reboot), browser-sync, copyfiles, del, express, autoprefixer, babel, cache, clean-css, concat, css-purge, htmlmin, image-resize, imagemin, inline-css, inline-source, newer, rename, responsive, rsync, sass, sourcemaps, uglify, util, jquery, sass, npm-check-updates and workbox-cli. The template contains a <strong>.htaccess</strong> file with caching rules for web server.</p>

<p><strong>«HTML Start Template»</strong> Start Template uses the best practices of web development.</p>

<p>Cross-browser compatibility: IE9+.</p>

<p>The template uses only <strong>Sass</strong> syntax..</p>

<h2>How to use «HTML Start Template»</h2>

<ol>
	<li><strong><a href="https://github.com/shamhaner/GULP/archive/master.zip">Download</a> «HTML Start Template»</strong> from GitHub;</li>
	<li>Install Node Modules: <strong>npm i</strong>;</li>
	<li>Run the template: <strong>gulp</strong>.</li>
</ol>

<h2>Gulp tasks:</h2>

<ul>
	<li><strong>gulp</strong>: run default gulp task (html, sass, js, fonts, watch, browserSync) for web development;</li>
	<li><strong>rsync</strong>: project deployment on the server from <strong>dist</strong> folder via <strong>RSYNC</strong>;</li>
</ul>

<h2>Rules for working with the «HTML Start Template»</h2>

<ol>
	<li>All HTML files should have similar initial content as in <strong>src/index.html</strong>;</li>
	<li><strong>Template Basic Images Start</strong> comment in src/index.html - all your custom template basic images (og:image for social networking, favicons for a variety of devices);</li>
	<li><strong>Custom Browsers Color Start</strong> comment in src/index.html: set the color of the browser head on a variety of devices;</li>
	<li><strong>Custom HTML</strong> comment in src/index.html - all your custom HTML;</li>
	<li>For installing new library, just run the command "<strong>npm i plugin-name -D</strong>" in the terminal. Libraries are automatically placed in the folder <strong>node_modules</strong>. Then place all new JS libraries paths in the <strong>'jsFiles'</strong> list (gulpfile.js);</li>		
	<li>To enable the <strong>HTML</strong> and <strong>CSS</strong> option <strong>«inline»</strong>, you need to uncomment the options in the «code» task;</li>
	<li>To enable the JS option «inline», you need to uncomment the parameter in the «code» task and add scripts to the <strong>src/index.html</strong> file at the end of the opening tag tag with a built-in space, similar to <script src = "main.js" <strong>inline</strong>></script>;</li>	
	<li>All custom JS located in <strong>src/main.js</strong>;</li>
	<li>All Sass vars placed in <strong>src/sass/_vars.sass | src/scss/_vars.scss</strong>;</li>
	<li>All Bootstrap media queries placed in <strong>src/sass/_media.sass</strong>;</li>
	<li>All libraries CSS styles placed in <strong>src/sass/_libs.sass</strong>;</li>
	<li>Rename <strong>ht.access</strong> to <strong>.htaccess</strong> before place it in your web server. This file contain rules for files caching on web server.</li>
</ol>
