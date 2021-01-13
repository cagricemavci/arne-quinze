(() => {
    const app = {
        initialize() {
            //create the navigation items out of navItems -> data.js
            this.createNavigation();
            //create the footer social items out of socialLinks -> data.js
            this.createSocialLinks();
            //create a scroll to top button
            this.createScrollTop();
            //If on press page*, create the press webpage
            this.createPress();
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
        createPress() {
            //get the right page from the urlParams
            let url = window.location.pathname;
            let pathArray = url.split('/')
            let currentPath = pathArray.slice(pathArray.length - 2).join('/').replace('app/',''); //press/index.html -> get the last part of the pathname from the url
            //if on the press page start the fetch
            if(currentPath === "press/index.html"){
                console.log('on the press page, fetching data is started...')
                let pressData = new fetchLocalData();
                pressData.pressData(json => {
                    console.log('The press data is fetched', json)
                    this.populatePress(json);
                }).catch(err => {console.error(err)});
            }
        },
        populatePress(json){
            //start populating the pressData
            console.log('populating with the received data has started...')
            let $pressReleasesUL = document.querySelector('#press-releases')
            let $inThePressUL = document.querySelector('#in-the-press')
            let strInThePress = "";
            let strPressReleases = "";

            json.forEach(obj => {
                if(obj.pressType === 'In the press'){
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
                                <a href="my-secret-garden-valencia/index.html">
                                    Learn more
                                </a>
                            </div>
                        </section>
                    </li> `
                } else if (obj.pressType === 'Press releases') {
                    strPressReleases += `
                    <li class="cards__item">
                        <section class="cards__item__img">
                            <img src="${obj.images[0]}"
                                alt="" loading="lazy">
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

                $pressReleasesUL.innerHTML = strPressReleases;
                $inThePressUL.innerHTML = strInThePress;
            })

        },
        createScrollTop() {
            let $body = document.querySelector('body')
            $body.innerHTML += 
            `<div id="goTopButton" class="hidden">
                <h3>Go to top</h3>
            </div>`
        },
        hideGoTop () {
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
             let currentPath = pathArray.slice(pathArray.length - 3).join('/').replace('app/',''); //press/index.html -> get the last part of the pathname from the url
            //start populating the navitems in de navigation list class
            let $navbarUL = document.querySelector('.nav__list');
            $navbarUL.innerHTML = navItems.map(item => {
                console.log('highlighting current page in the navigation...', currentPath, 'with the following items: ', item)
                //highlight the current page in the navigation list items, by adding the class "current" to the list item
                if(currentPath.includes(item.urlFirstPart)) {
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
                    <a href="${link.URL}">
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