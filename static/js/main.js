(() => {
    const app = {
        initialize() {
            //create the navigation items out of navItems -> data.js
            this.createNavigation();
            //create the footer social items out of socialLinks -> data.js
            this.createSocialLinks();
            //create a scroll to top button
            this.createScrollTop();
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
        createScrollTop() {
            let $body = document.querySelector('body')
            $body.innerHTML += `<div id="goTopButton" class="hidden"></div>`
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
             let currentPath = url.split('/')[url.split('/').length-1]; //index.html -> get the last part of the pathname from the url
 
            //start populating the navitems in de navigation list class
            let $navbarUL = document.querySelector('.nav__list');
            $navbarUL.innerHTML = navItems.map(item => {
                //highlight the current page in the navigation list items, by adding the class "current" to the list item
                if(currentPath === item.url) {
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