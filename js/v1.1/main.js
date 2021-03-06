//once all HTML has loaded
$(function () {

    //video list
    var videos = null;
    //category list
    var categories = null;

    //find DOM elements
    var videoList = $('.video-list'),
        categoryList = $('.category-list'),
        searchbox = $('#searchbox'),
        player = $('#player');
         
    /**
     * Initialise the app.
     */
    function init() {
        //get videos from JSON file
        $.getJSON('json/videos.json', function(data){
            videos = data.videos;
            displayVideos(videos);
        });

        //get categories from JSON file
        $.getJSON('json/categories.json', function(data){
            categories = data.categories;
            displayCategories(categories);
        });

        searchbox.on('keyup', function (evt) {
            evt.preventDefault();
            if (evt.which === 13) {
                displayVideoByID($(this));
            }
        });       
    }
    
    /**
     * Display a video by its ID.
     * @param  {HTMLInputElement} searchbox
     */
    function displayVideoByID(searchbox) {
        var inputValue = searchbox.val();
        //find out if ID exists in DB
        $.each(videos, function(i, video){
            var id = video.id;
            if(id === inputValue){
                displayVideos([video]);
                return;
            }
        });
    }
    
    /**
     * Get the HTML template for each video list item.
     * @param  {Video} video
     */
    function getHTMLVideoItem(video) {
        return `<div data-id="${video.id}" class="video-list--item">
                    <div></div>
                    <div>
                        <h3>${video.title}</h3>
                        <p>${video.category}</p>
                    </div>
                </div>`;
    }

     /**
     * Get the HTML template for each category list item.
     * @param  {Category} category
     */
    function getHTMLCategoryItem(category) {
        return `<li data-category="${category.slug}" class="category-list--item">                   
                    ${category.title}
                </li>`;
    }

    /**
     * Display a list of videos.
     * @param  {Array<Video>} videos
     */
    function displayVideos(videos) {
        var s = '';
        $.each(videos, function (i, video) {
            s = s + getHTMLVideoItem(video);
        });
        //set inner HTML of video list container with items
        videoList.html(s);
        //target the videos
        var videos = $('.video-list--item');
        //loop through and add click event listeners
        $.each(videos, function (i, video) {
            $(this).on('click', function(){
                playVideo($(this));
            });
        });
    }

    /**
     * Get videos by category.
     * @param  {Category} category
     */
    function displayVideosByCategory(category){
        //create an empty "filteredVideos" array
        var filteredVideos = [];
        //loop through the videos ("videos" variable is global so you can use it)
        $.each(videos, function (i, video) {
            //if video category equals category, add the video to array
            if(video.category === category){
                filteredVideos.push(video);
            }
        });  

        //display the videos
        displayVideos(filteredVideos);
    }

      /**
     * Display a list of categories.
     * @param  {Array<Category>} categories
     */
    function displayCategories(categories) {
        var s = '';
        $.each(categories, function (i, category) {
            s = s + getHTMLCategoryItem(category);
        });
        //set inner HTML of video list container with items
        categoryList.html(s);

        //target the videos
        var categories = $('.category-list--item');
        //loop through and add click event listeners
        $.each(categories, function (i, category) {
            $(this).on('click', function(){
                var category = $(this).data('category');
                displayVideosByCategory(category);
            });
        });
    }

    /**
     * Play the video.
     * @param  {HTMLDivElement} listItem
     */
    function playVideo(listItem) {
        var videoId = listItem.data('id');
        player.attr('src', 'http://www.youtube.com/embed/'+ videoId + '?autoplay=1');
    }

    init();
});