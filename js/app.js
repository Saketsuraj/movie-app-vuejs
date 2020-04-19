const baseUrl = "https://api.themoviedb.org/3/movie/";

//Building dynamic API URL
function buildUrl(url, page) {
    return baseUrl + url + "?api_key=" + API_KEY + "&language=en-US&page=" + page;
}
//App declaration
var movieList = new Vue({
    el: '#movieListContainer',
    data: {
        toptitle: 'Top rated movies list',
        upcomingTitle: 'Upcoming movies',
        results: [],
        page_no: 1,
        total_pages: 0,
        next_disable: false,
        previous_disable: true,
        activeTab: 'topRated'
    },
    mounted() {
        this.getMovies('top_rated', 1); //Setting top rated movies as default
    },
    methods: {
        //Tab functions
        isActive(menuItem) {
            return this.activeTab === menuItem;
        },
        setActive(menuItem) {
            this.activeTab = menuItem;
            if (this.activeTab == "topRated") {
                this.getMovies('top_rated', this.page_no);
            }
            else {
                this.getMovies('upcoming', this.page_no);
            }

        },
        //Fetching Movies
        getMovies(page_url, page) {

            let url = buildUrl(page_url, page);
            axios.get(url).then((response) => {
                this.results = response.data.results;
                this.total_pages = response.data.total_pages;
            }).catch((error) => { console.log(error); });

        },
        //Next page
        fetchNext() {
            this.page_no += 1;
            if (this.page_no == this.total_pages) {
                this.next_disable = true;
                this.previous_disable = false;
            }
            if (this.page_no == 1) {
                this.previous_disable = true;
            }
            else if (this.page_no > 1) {
                this.previous_disable = false;
            }
            if (this.activeTab == "topRated") {
                this.getMovies('top_rated', this.page_no);
            }
            else {
                this.getMovies('upcoming', this.page_no);
            }
        },
        //Previous page
        fetchPrevious() {

            if (this.page_no == 1) {
                this.previous_disable = true;
            }
            else if (this.page_no > 1) {
                this.page_no--;
                if (this.page_no == 1) {
                    this.previous_disable = true;
                }
                if (this.activeTab == "topRated") {
                    this.getMovies('top_rated', this.page_no);
                }
                else {
                    this.getMovies('upcoming', this.page_no);
                }
            }
        }
    }
});

//Movie card component
Vue.component('movie-list', {
    props: ['movie'],
    template: `
    <div class="col-md-4">
        <div class="detail-holder">
            <img src="images/no_img.png" alt="">
            <div class="detail">
                <div><span class="d-left">{{movie.title}}</span><span class="d-right">{{movie.vote_average}}/10</span></div>
                <p class="d-overview" v-bind:title="movie.overview" v-text="movie.overview"></p>
                <p class="d-date">Release date : <span>{{movie.release_date}}</span></p>
            </div>
        </div>
    </div>`
});