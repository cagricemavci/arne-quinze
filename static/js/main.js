(() => {
    const app = {
        initialize() {
            //create the navigation items out of navItems -> data.js
            this.createNavigation();
            //create the footer social items out of socialLinks -> data.js
            this.createSocialLinks();
            //create the footer instagram items
            this.createInstaLinks();
            //create a scroll to top button
            this.createScrollTop();
            //If on press page*, create the press webpage
            this.fetchData();
            //add event listeners
            this.registerEventListeners();
        },
        registerEventListeners() {
            //add a scroll to the window to hide/unhide the goToTop-button
            window.addEventListener('scroll', this.hideGoTop);
            //add an event to the scroll to top element
            this.$goTopBtn = document.querySelector("#goTopButton")
            if (this.$goTopBtn !== null) {
                this.$goTopBtn.addEventListener('click', (event) => {
                    this.goTopBtnFunction();
                })
            }

        },
        createInstaLinks() {
            document.querySelector('.insta__feed__list').innerHTML = instaImages.map(image => {
                return `
                <li class="insta__feed__item">
                    <a href="www.instagram.com" target="_blank">
                        <img src="${image.path}"
                        alt="picture from Arne Quinze's instagram feed" loading="lazy">
                    </a>
                </li>`
            }).join('')
        },
        fetchData() {
            //get the right page from the urlParams
            let url = window.location.pathname;
            let pathArray = url.split('/')
            let currentPath = pathArray.slice(pathArray.length - 2).join('/')//.replace('app/', ''); //press/index.html -> get the last part of the pathname from the url
            //if on the press page OR on art page, start the fetch
            if (currentPath === "press/index.html") {
                console.log('on the press page, fetching data is started...')
                let fetchData = new fetchLocalData();
                fetchData.pressData(json => {
                    console.log('The press data is fetched', json)
                    this.populatePress(json);
                }).catch(err => {
                    console.error(err)
                });
            } else if (currentPath === "art-and-exhibitions/index.html") {
                console.log('on the art page, fetching data is started...')
                let fetchData = new fetchLocalData();
                fetchData.artData(json => {
                    console.log('The art data is fetched', json)
                    this.createArt(json);
                }).catch(err => {
                    console.error(err)
                });
            } else if (currentPath === "atelier-studio/index.html") {
                console.log('on the atelier page, fetching data is started...')
                let fetchData = new fetchLocalData();
                fetchData.atelierData(json => {
                    console.log('The atelier data is fetched', json)
                    this.populateAtelier(json);
                }).catch(err => {
                    console.error(err)
                });
            } else if (currentPath === "app/index.html") {
                console.log('on the home page, fetching data is started...')
                let fetchData = new fetchLocalData();
                fetchData.atelierData(json => {
                    console.log('The atelier data is fetched', json)
                    this.randomHomePage('atelier', json);
                }).catch(err => {
                    console.error(err)
                });

                fetchData.artData(json => {
                    console.log('The art data is fetched', json)
                    this.randomHomePage('art', json);
                }).catch(err => {
                    console.error(err)
                });

            } else {
                console.log('no data is being fetched from local fetch')
            }
        },
        randomHomePage(str, json){

            //check if its atelier data or art data that is fetched. populate the appropriate list from the home page
            if(str === 'atelier'){
                //1. slice to get the first 3, 2. map en join to list element
                document.querySelector('.atelier').innerHTML = json.slice(0, 3).map(x => { 
                    return `  <li class="cards__item">
                                <section class="cards__item__img">
                                    <img src="${x.images[0]}"
                                        alt="${x.titel}">
                                </section>
                                <section class="cards__item__content">
                                    <div>
                                        <h4>${x.subtitel}</h4>
                                    </div>
                                    <div>
                                        <h3>${x.titel}</h3>
                                    </div>
                                    <div>
                                        <p>${x.synopsis}</p>
                                    </div>
                                    <div class="cards__item__link">
                                        <a href="atelier-studio/visiting-mons-again/index.html">
                                            Learn more
                                        </a>
                                    </div>
                                </section>
                            </li>`}).join('')
            } else if (str === 'art') {
                //1.filter to get the highlight -true- data 2. slice to have 3. 4. map and join to list element
                document.querySelector('.art').innerHTML = json.filter(x => { return x.highlight === true}).slice(0, 3).map(x => {
                    return `
                    <li class="cards__item">
                        <section class="cards__item__img">
                            <img src="static/img/arts/${x.images[0]}"
                                alt="${x.titel}">
                        </section>
                        <section class="cards__item__content">
                            <div>
                                <h4>${x.titel} - ${x.location}</h4>
                            </div>
                            <div>
                                <h3>${x.titel}</h3>
                            </div>
                            <div>
                                <p>${x.subtitel}</p>
                            </div>
                            <div class="cards__item__link">
                                <a href="art-and-exhibitions/in-dialogue-with-calatrava/index.html">
                                    Learn more
                                </a>
                            </div>
                        </section>
                    </li>`
                }).join('')
            }
        },
        populateAtelier(json) {
            //start populating the atelierData
            console.log('populating with the received data has started...')
            let $atelierUL = document.querySelector('.cards__list')
            let str = '';

            $atelierUL.innerHTML = json.map(x => { 
                return `
                <li class="cards__item">
                <section class="cards__item__img">
                    <img src="${x.images[0]}"
                        alt="${x.titel}" loading="lazy">
                </section>
                <section class="cards__item__content">
                    <div>
                        <h4>${x.subtitel}</h4>
                    </div>
                    <div>
                        <h3>${x.titel}</h3>
                    </div>
                    <div>
                        <p>${x.synopsis}</p>
                    </div>
                    <div class="cards__item__link">
                        <a href="atelier-studio/visiting-mons-again/index.html">
                            Learn more
                        </a>
                    </div>
                </section>
            </li>`}).join('')
        },
        populatePress(json) {
            //start populating the pressData
            console.log('populating with the received data has started...')
            let $pressReleasesUL = document.querySelector('#press-releases')
            let $inThePressUL = document.querySelector('#in-the-press')
            let strInThePress = "";
            let strPressReleases = "";

            json.forEach(obj => {
                if (obj.pressType === 'In the press') {
                    strInThePress += `
                    <li class="cards__item">
                        <section class="cards__item__img">
                            <img src="${obj.images[0]}"
                                alt="image of ${obj.titel}" loading="lazy">
                        </section>
                        <section class="cards__item__content">
                            <div>
                                <h4>${obj.titel}, ${obj.location}</h4>
                            </div>
                            <div>
                                <h3>${obj.titel}</h3>
                            </div>
                            <div>
                                <p>${obj.subtitel}</p>
                            </div>
                            <div class="cards__item__link">
                                <a href="press/my-secret-garden-valencia/index.html">
                                    Learn more
                                </a>
                            </div>
                        </section>
                    </li> `
                } else if (obj.pressType === 'Press releases') {
                    strPressReleases += `
                    <li class="cards__item">
                        <section class="cards__item__img">
                            <img src="${(obj.images[0] !== null) ? obj.images[0] : imageNotFound }"
                                alt="${obj.titel}" loading="lazy">
                        </section>
                        <section class="cards__item__content">
                            <div>
                                <h4>${obj.titel}, ${obj.location}</h4>
                            </div>
                            <div>
                                <h3>${obj.titel}</h3>
                            </div>
                            <div>
                                <p>${obj.subtitel}</p>
                            </div>
                            <div class="cards__item__link">
                                <a href="press/my-secret-garden-valencia/index.html">
                                    Learn more
                                </a>
                            </div>
                        </section>
                    </li> `
                } else {
                    console.error('invalid json value', obj)
                }
            })
            $pressReleasesUL.innerHTML = strPressReleases;
            $inThePressUL.innerHTML = strInThePress;
        },
        createArt(json) {
            //start populating the artPage
            console.log('populating with the received data has started...')

            //prepare the filter lists: YEAR and TAGS array(unique)
            let yearArray = [];
            let tagArray = [];

            //loop through data to gather year and tags info
            json.forEach(art => {
                let year = String(art.year)
                if (!(yearArray.indexOf(year) > -1)) {
                    yearArray.push(year) //push years uniquely to array
                }

                //get the tags info, also check if there isn't an empty tag array, in fetched data
                let tags = art.tags;
                tags.forEach(tag => {
                    if (tag.length >= 1 && !(tagArray.indexOf(tag) > -1)) {
                        tagArray.push(tag)
                    }
                })

            })
            yearArray = yearArray.sort((a, b) => a + b) //sort the array in descending order
            tagArray = tagArray.sort((a, b) => a + b) //sort the array in descending order
            console.log('found following years in data: ', yearArray, 'found following tags in data: ', tagArray)

            //inject the data to the appropriate lists
            //add view all button to this list
            document.querySelector('.cat__filter__list').innerHTML = `
                <li class="cat__filter__item" >
                    <a href="art-and-exhibitions/index.html#" id="reset-filter-tag">View all</a>
                </li>`

            document.querySelector('.cat__filter__list').innerHTML += tagArray.map(tag => {
                return `
                <li class="cat__filter__item">
                    <a href="art-and-exhibitions/index.html#">${tag}</a>
                </li>`
            }).join('')

            //add view all button to this list
            document.querySelector('.year__filter__list').innerHTML = `
                <li class="year__filter__item">
                    <a href="art-and-exhibitions/index.html#" id="reset-filter-year">View all</a>
                </li>`

            document.querySelector('.year__filter__list').innerHTML += yearArray.map(year => {
                return `
                <li class="year__filter__item">
                    <a href="art-and-exhibitions/index.html#">${year}</a>
                </li>`
            }).join('')

            //add event listeners to the filters
            let $tagsList = document.querySelectorAll('.cat__filter__list li a')
            let $yearList = document.querySelectorAll('.year__filter__list li a')
            $tagsList.forEach(tag => {
                tag.addEventListener('click', event => {
                    this.tagFilter = tag.innerText;
                    this.fetchData();
                    return false;

                })
            })

            $yearList.forEach(year => {
                year.addEventListener('click', event => {
                    this.yearFilter = year.innerText;
                    this.fetchData();
                    return false;
                })
            })

            //eventlisteners for the View All buttons 
            document.querySelector('#reset-filter-tag').addEventListener('click', event => {
                this.tagFilter = ''
            })
            document.querySelector('#reset-filter-year').addEventListener('click', event => {
                this.yearFilter = ''
            })

            //arts page is prepared and the main content can be loaded to the page
            this.populateArt(json)
        },
        populateArt(json) {
            //check if a filter is used, filter json data accordingly
            if (this.yearFilter !== undefined && this.yearFilter !== null && this.yearFilter !== '') {
                console.log('year filter is used: ', this.yearFilter)
                json = json.filter(x => {
                    return x.year === this.yearFilter
                })
                //this.yearFilter = '';
            }
            if (this.tagFilter !== undefined && this.tagFilter !== null && this.tagFilter !== '') {
                console.log('tag filter is used: ', this.tagFilter)
                json = json.filter(x => {
                    return x.tags.includes(this.tagFilter)
                })
                //this.tagFilter = '';
            }

            //loop through data to gather year and tags info
            let yearArray = [];
            let tagArray = [];
            json.forEach(art => {
                let year = String(art.year)
                if (!(yearArray.indexOf(year) > -1)) {
                    yearArray.push(year) //push years uniquely to array
                }

                //get the tags info, also check if there isn't an empty tag array, in fetched data
                let tags = art.tags;
                tags.forEach(tag => {
                    if (tag.length >= 1 && !(tagArray.indexOf(tag) > -1)) {
                        tagArray.push(tag)
                    }
                })

            })
            yearArray = yearArray.sort((a, b) => a + b) //sort the array in descending order
            tagArray = tagArray.sort((a, b) => a + b) //sort the array in descending order
            //start populating the html content
            let str = '';
            //for each year that's found in the data
            yearArray.forEach(year => {
                let filteredByYear = json.filter(x => {
                    return x.year === year
                }) //filter the arts that have the same year as current loop
                let strArtContent = '';
                filteredByYear.forEach(art => {
                    strArtContent += `
                    <li class="art__card__item">
                        
                            <div class="card__content">
                            <a href="art-and-exhibitions/in-dialogue-with-calatrava/index.html">
                                <h2>${art.title}</h2>
                                <h3>${art.subtitle}</h3>
                                <h3>${art.tags.map(tag => {return `
                                ${tag}`}).join(' /')} - ${art.location}</h3>
                                </a>
                            </div>
                       
                            <ul class="card__images__list">
                                ${art.images.map(img => {return `
                                    <li class="card__images__item">
                                        <div>
                                            <img src="${(img !== null)? `static/img/arts/` + img : imageNotFound}" alt="image of ${art.title}" loading="lazy">
                                        </div>
                                    </li>`
                                }).join('')}
                            </ul>
                    </li>`
                })
                str += `
                <li class="art__cards__item" id="${year}">
                    <div class="item__year">
                        <h2>${year}</h2>
                    </div>
                    <ul class="art__card__list">
                        ${strArtContent}
                    </ul>
                
                </li>`
            })

            document.querySelector('.art__cards__list').innerHTML = str;
        },
        createScrollTop() {
            let $body = document.querySelector('body')
            $body.innerHTML +=
                `<div id="goTopButton" class="hidden">
                <h3>Go to top</h3>
            </div>`
        },
        hideGoTop() {
            this.$goTopBtn = document.querySelector("#goTopButton")
            let currentPosi = window.scrollY;
            if (currentPosi > 100) {
                this.$goTopBtn.classList.remove('hidden')
            } else {
                this.$goTopBtn.classList.add('hidden')
            }
        },
        goTopBtnFunction() {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth"
            })
        },
        createNavigation() {
            //get the right page from the urlParams
            let url = window.location.pathname;
            let pathArray = url.split('/')
            let currentPath = pathArray.slice(pathArray.length - 3).join('/').replace('app/', ''); //press/index.html -> get the last part of the pathname from the url
            //start populating the navitems in de navigation list class
            let $navbarUL = document.querySelector('.nav__list');
            $navbarUL.innerHTML = navItems.map(item => {
                //highlight the current page in the navigation list items, by adding the class "current" to the list item
                if (currentPath.includes(item.urlFirstPart)) {
                    console.log('highlighting current page in the navigation...', currentPath, 'with the following items: ', item)
                    return `
                    <li class="nav__item current">
                        <a href="${item.url}">
                            ${item.name}
                        </a>
                    </li>`
                } else {
                    return `
                    <li class="nav__item">
                        <a href="${item.url}">
                            ${item.name}
                        </a>
                    </li>`
                }
            }).join('')
        },
        createSocialLinks() {
            //start populating the socialLinks in the footer list class
            let $footerSocialLinksUL = document.querySelector('.footer__social__list');
            $footerSocialLinksUL.innerHTML = socialLLinks.map(link => {
                return `
                <li class="footer__social__item">
                    <a href="${link.URL}" target="_blank">
                        <div class="social__item__icon">
                            ${link.svg}
                        </div>
                        <div>
                            <p>${link.name}</p>
                        </div>
                    </a>
                </li>`
            }).join('')
        }
    }
    app.initialize();
})();