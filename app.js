window.addEventListener('load', () => {
            const progressBar = document.getElementById('progress-bar');
            const preloader = document.getElementById('preloader');
            
            let width = 0;
            const interval = setInterval(() => {
                if (width >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        preloader.style.opacity = '0';
                        setTimeout(() => {
                            preloader.style.display = 'none';
                            initAnimations();
                        }, 800);
                    }, 500);
                } else {
                    width += Math.random() * 15;
                    if(width > 100) width = 100;
                    progressBar.style.width = width + '%';
                }
            }, 150);
        });

        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');

        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        const mobileBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        function initAnimations() {
            AOS.init({
                duration: 1000,
                easing: 'ease-out-cubic',
                once: true,
                mirror: false
            });
            
            const skillBars = document.querySelectorAll('.skill-bar-fill');
            skillBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width;
            });
        }

        // 3D Tilt Effect for Hero Image
        const heroWrapper = document.getElementById('heroImageWrapper');
        const heroFrame = document.getElementById('heroImageFrame');

        if(heroWrapper && heroFrame) {
            heroWrapper.addEventListener('mousemove', (e) => {
                const rect = heroWrapper.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg rotation
                const rotateY = ((x - centerX) / centerX) * 10;

                heroFrame.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            heroWrapper.addEventListener('mouseleave', () => {
                heroFrame.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
            });
        }

        function initThreeJS() {
            const container = document.getElementById('robot-container');
            const scene = new THREE.Scene();
            
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 5;

            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            container.appendChild(renderer.domElement);

            const robotGroup = new THREE.Group();

            const headGeo = new THREE.IcosahedronGeometry(1.5, 1);
            const headMat = new THREE.MeshBasicMaterial({ 
                color: 0x6366f1, 
                wireframe: true,
                transparent: true,
                opacity: 0.15
            });
            const head = new THREE.Mesh(headGeo, headMat);
            robotGroup.add(head);

            const coreGeo = new THREE.SphereGeometry(0.8, 32, 32);
            const coreMat = new THREE.MeshBasicMaterial({ color: 0xec4899, transparent: true, opacity: 0.8 });
            const core = new THREE.Mesh(coreGeo, coreMat);
            robotGroup.add(core);

            const ringGeo = new THREE.TorusGeometry(2.2, 0.02, 16, 100);
            const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1 });
            const ring1 = new THREE.Mesh(ringGeo, ringMat);
            const ring2 = new THREE.Mesh(ringGeo, ringMat);
            
            ring1.rotation.x = Math.PI / 2;
            ring2.rotation.y = Math.PI / 2;
            
            robotGroup.add(ring1);
            robotGroup.add(ring2);

            scene.add(robotGroup);

            const particlesGeo = new THREE.BufferGeometry();
            const particlesCount = 700;
            const posArray = new Float32Array(particlesCount * 3);

            for(let i = 0; i < particlesCount * 3; i++) {
                posArray[i] = (Math.random() - 0.5) * 20;
            }

            particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            const particlesMat = new THREE.PointsMaterial({
                size: 0.03,
                color: 0x6366f1,
                transparent: true,
                opacity: 0.6
            });
            const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
            scene.add(particlesMesh);

            function animate() {
                requestAnimationFrame(animate);

                robotGroup.rotation.y += 0.003;
                robotGroup.rotation.x += 0.001;
                
                ring1.rotation.x += 0.005;
                ring1.rotation.y += 0.005;
                
                ring2.rotation.x -= 0.005;
                ring2.rotation.y -= 0.005;

                particlesMesh.rotation.y -= 0.001;
                
                robotGroup.position.y = Math.sin(Date.now() * 0.001) * 0.2;

                renderer.render(scene, camera);
            }

            animate();

            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
        }

        initThreeJS();

        const serviceData = {
            'webdev': {
                title: 'Web Development Services',
                icon: 'fa-laptop-code',
                content: `
                    <p class="text-gray-300 mb-6 text-lg">I build robust, scalable, and high-performance websites tailored to your business needs.</p>
                    <h4 class="text-white font-bold text-xl mb-4">What's Included:</h4>
                    <ul class="list-disc list-inside text-gray-400 space-y-2 mb-6">
                        <li>Custom Website Development (HTML/CSS/JS)</li>
                        <li>React.js Single Page Applications</li>
                        <li>Responsive Design for all devices</li>
                        <li>Performance Optimization</li>
                        <li>Cross-Browser Compatibility</li>
                    </ul>
                    <a href="#contact" onclick="closeServiceModal()" class="btn-primary mt-4">Get a Quote</a>
                `
            },
            'shopify': {
                title: 'Shopify Store Design',
                icon: 'fa-shopify',
                content: `
                    <p class="text-gray-300 mb-6 text-lg">Launch your e-commerce business with a professional Shopify store.</p>
                    <h4 class="text-white font-bold text-xl mb-4">What's Included:</h4>
                    <ul class="list-disc list-inside text-gray-400 space-y-2 mb-6">
                        <li>Store Setup & Configuration</li>
                        <li>Custom Theme Development (Liquid)</li>
                        <li>Product Upload & Management</li>
                        <li>Payment Gateway Integration</li>
                        <li>App Installation & Setup</li>
                    </ul>
                    <a href="#contact" onclick="closeServiceModal()" class="btn-primary mt-4">Get a Quote</a>
                `
            },

            'responsive-web-design': {
                title: 'Responsive Web Design',
                icon: 'fa-mobile-alt', // You can change this FontAwesome icon to fit your needs (e.g., fa-laptop-code, fa-desktop)
                content: `
                    <p class="text-gray-300 mb-6 text-lg">I ensure your website looks stunning and functions flawlessly on desktops, tablets, and smartphones.</p>
                    <h4 class="text-white font-bold text-xl mb-4">What's Included:</h4>
                    <ul class="list-disc list-inside text-gray-400 space-y-2 mb-6">
                        <li>Mobile-first design approach</li>
                        <li>Fluid grid layouts and flexible images</li>
                        <li>Custom media queries implementation</li>
                        <li>Touch-friendly navigation</li>
                        <li>Cross-device and screen size testing</li>
                    </ul>
                    <a href="#contact" onclick="closeServiceModal()" class="btn-primary mt-4">Get a Quote</a>
                `
            },

            'ecommerce-design': {
                title: 'E-commerce Website Design',
                icon: 'fa-shopping-cart',
                content: `
                    <p class="text-gray-300 mb-6 text-lg">I develop comprehensive, secure, and user-friendly online stores to help you sell products seamlessly.</p>
                    <h4 class="text-white font-bold text-xl mb-4">What's Included:</h4>
                    <ul class="list-disc list-inside text-gray-400 space-y-2 mb-6">
                        <li>Product catalog and shopping cart design</li>
                        <li>Secure and smooth checkout process</li>
                        <li>User account dashboards</li>
                        <li>Inventory management integration</li>
                        <li>Coupon and discount system setup</li>
                    </ul>
                    <a href="#contact" onclick="closeServiceModal()" class="btn-primary mt-4">Get a Quote</a>
                `
            },

            'frontend': {
                title: 'Frontend Development',
                icon: 'fa-mobile-alt',
                content: `
                    <p class="text-gray-300 mb-6 text-lg">Turning designs into reality with pixel-perfect, interactive interfaces.</p>
                    <h4 class="text-white font-bold text-xl mb-4">What's Included:</h4>
                    <ul class="list-disc list-inside text-gray-400 space-y-2 mb-6">
                        <li>HTML5, CSS3, JavaScript (ES6+)</li>
                        <li>React.js Component Development</li>
                        <li>Tailwind CSS / Bootstrap Styling</li>
                        <li>Animation & Interactivity</li>
                        <li>API Integration</li>
                    </ul>
                    <a href="#contact" onclick="closeServiceModal()" class="btn-primary mt-4">Get a Quote</a>
                `
            },
            'shopify-seo': {
                title: 'Shopify SEO & Marketing',
                icon: 'fa-search-dollar',
                content: `
                    <p class="text-gray-300 mb-6 text-lg">Optimize your Shopify store to rank higher on Google and drive organic traffic and sales.</p>
                    <h4 class="text-white font-bold text-xl mb-4">What's Included:</h4>
                    <ul class="list-disc list-inside text-gray-400 space-y-2 mb-6">
                        <li>On-Page SEO & Product Optimization</li>
                        <li>Google Search Console & Analytics setup</li>
                        <li>Site speed and performance optimization</li>
                        <li>Schema markup and structured data</li>
                    </ul>
                    <a href="#contact" onclick="closeServiceModal()" class="btn-primary mt-4">Get a Quote</a>
                `
            },
            'shopify-migration': {
                title: 'Shopify Store Migration',
                icon: 'fa-exchange-alt',
                content: `
                    <p class="text-gray-300 mb-6 text-lg">Seamlessly migrate your existing online store from WordPress, WooCommerce, or Wix to Shopify.</p>
                    <h4 class="text-white font-bold text-xl mb-4">What's Included:</h4>
                    <ul class="list-disc list-inside text-gray-400 space-y-2 mb-6">
                        <li>Safe product, customer, and order data transfer</li>
                        <li>SEO link redirection (301 redirects)</li>
                        <li>Design replication or enhancement</li>
                        <li>Zero downtime transition management</li>
                    </ul>
                    <a href="#contact" onclick="closeServiceModal()" class="btn-primary mt-4">Get a Quote</a>
                `
            },
            'shopify-maintenance': {
                title: 'Shopify Support & Maintenance',
                icon: 'fa-tools',
                content: `
                    <p class="text-gray-300 mb-6 text-lg">Keep your Shopify store secure, updated, and running without any technical glitches.</p>
                    <h4 class="text-white font-bold text-xl mb-4">What's Included:</h4>
                    <ul class="list-disc list-inside text-gray-400 space-y-2 mb-6">
                        <li>Regular bug fixing and troubleshooting</li>
                        <li>App audits and conflicts resolution</li>
                        <li>Checkout flow and UX testing</li>
                        <li>Monthly store performance reporting</li>
                    </ul>
                    <a href="#contact" onclick="closeServiceModal()" class="btn-primary mt-4">Get a Quote</a>
                `
            },

            'uiux': {
                title: 'UI/UX Design',
                icon: 'fa-paint-brush',
                content: `
                    <p class="text-gray-300 mb-6 text-lg">User-centric design that looks great and feels intuitive.</p>
                    <h4 class="text-white font-bold text-xl mb-4">What's Included:</h4>
                    <ul class="list-disc list-inside text-gray-400 space-y-2 mb-6">
                        <li>Wireframing & Prototyping</li>
                        <li>Figma / Adobe XD Design</li>
                        <li>User Flow Analysis</li>
                        <li>Mobile-First Design Approach</li>
                        <li>Brand Identity Integration</li>
                    </ul>
                    <a href="#contact" onclick="closeServiceModal()" class="btn-primary mt-4">Get a Quote</a>
                `
            },
            'landing': {
                title: 'Landing Page Design',
                icon: 'fa-layer-group',
                content: `
                    <p class="text-gray-300 mb-6 text-lg">High-converting landing pages designed to capture leads and drive sales.</p>
                    <h4 class="text-white font-bold text-xl mb-4">What's Included:</h4>
                    <ul class="list-disc list-inside text-gray-400 space-y-2 mb-6">
                        <li>Conversion Rate Optimization</li>
                        <li>A/B Testing Ready Structure</li>
                        <li>Fast Loading Speed</li>
                        <li>Compelling Call-to-Actions</li>
                        <li>Lead Form Integration</li>
                    </ul>
                    <a href="#contact" onclick="closeServiceModal()" class="btn-primary mt-4">Get a Quote</a>
                `
            },
            'business': {
                title: 'Business Websites',
                icon: 'fa-briefcase',
                content: `
                    <p class="text-gray-300 mb-6 text-lg">Establish your online presence with a professional corporate website.</p>
                    <h4 class="text-white font-bold text-xl mb-4">What's Included:</h4>
                    <ul class="list-disc list-inside text-gray-400 space-y-2 mb-6">
                        <li>Corporate Branding</li>
                        <li>Service/Product Showcase</li>
                        <li>Contact & Map Integration</li>
                        <li>Blog/News Section</li>
                        <li>SEO Friendly Structure</li>
                    </ul>
                    <a href="#contact" onclick="closeServiceModal()" class="btn-primary mt-4">Get a Quote</a>
                `
            },
            'seo': {
                title: 'SEO Optimization',
                icon: 'fa-search-dollar',
                content: `
                    <p class="text-gray-300 mb-6 text-lg">Improve your visibility on Google and drive organic traffic.</p>
                    <h4 class="text-white font-bold text-xl mb-4">What's Included:</h4>
                    <ul class="list-disc list-inside text-gray-400 space-y-2 mb-6">
                        <li>Keyword Research</li>
                        <li>On-Page SEO</li>
                        <li>Meta Tags Optimization</li>
                        <li>Speed Optimization</li>
                        <li>Mobile Usability Check</li>
                    </ul>
                    <a href="#contact" onclick="closeServiceModal()" class="btn-primary mt-4">Get a Quote</a>
                `
            },
            'maintenance': {
                title: 'Website Maintenance',
                icon: 'fa-tools',
                content: `
                    <p class="text-gray-300 mb-6 text-lg">Keep your website secure, up-to-date, and running smoothly.</p>
                    <h4 class="text-white font-bold text-xl mb-4">What's Included:</h4>
                    <ul class="list-disc list-inside text-gray-400 space-y-2 mb-6">
                        <li>Regular Backups</li>
                        <li>Security Updates</li>
                        <li>Bug Fixes</li>
                        <li>Content Updates</li>
                        <li>Performance Monitoring</li>
                    </ul>
                    <a href="#contact" onclick="closeServiceModal()" class="btn-primary mt-4">Get a Quote</a>
                `
            },
            'portfolio': {
                title: 'Portfolio Design',
                icon: 'fa-id-card',
                content: `
                    <p class="text-gray-300 mb-6 text-lg">Showcase your work and skills with a stunning personal portfolio website.</p>
                    <h4 class="text-white font-bold text-xl mb-4">What's Included:</h4>
                    <ul class="list-disc list-inside text-gray-400 space-y-2 mb-6">
                        <li>Personal Branding</li>
                        <li>Project Showcase</li>
                        <li>Resume/CV Integration</li>
                        <li>Contact Forms</li>
                        <li>Social Media Links</li>
                    </ul>
                    <a href="#contact" onclick="closeServiceModal()" class="btn-primary mt-4">Get a Quote</a>
                `
            },
            'ecommerce': {
                title: 'E-commerce UI',
                icon: 'fa-shopping-cart',
                content: `
                    <p class="text-gray-300 mb-6 text-lg">Create a seamless shopping experience for your customers.</p>
                    <h4 class="text-white font-bold text-xl mb-4">What's Included:</h4>
                    <ul class="list-disc list-inside text-gray-400 space-y-2 mb-6">
                        <li>Product Page Design</li>
                        <li>Cart & Checkout Flow</li>
                        <li>User Account Dashboard</li>
                        <li>Search & Filter Functionality</li>
                        <li>Mobile Responsive Design</li>
                    </ul>
                    <a href="#contact" onclick="closeServiceModal()" class="btn-primary mt-4">Get a Quote</a>
                `
            }
        };

        function openServiceModal(serviceId) {
            const modal = document.getElementById('serviceModal');
            const modalBody = document.getElementById('serviceModalBody');
            const data = serviceData[serviceId];

            if(data) {
                modalBody.innerHTML = `
                    <div class="flex items-center gap-4 mb-6">
                        <div class="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-3xl">
                            <i class="fas ${data.icon}"></i>
                        </div>
                        <h2 class="text-3xl font-bold text-white">${data.title}</h2>
                    </div>
                    ${data.content}
                `;
                modal.classList.add('active');
            }
        }

        function closeServiceModal() {
            document.getElementById('serviceModal').classList.remove('active');
        }

        const projectsData = {
            'proj1': {
                title: 'The Nex Aura',
                img: 'landing/img/3ce93390-6ea3-4290-911f-0f774e73f4b9.jpg',
                desc: 'Premium e-commerce store with advanced product filtering and seamless checkout experience.',
                tech: ['Shopify', 'Liquid'],
                link: 'https://thenexaura.store/'
            },
            'proj2': {
                title: 'Bagx.pk',
                img: 'landing/img/Bagx.jpg',
                desc: 'Fashionable bag store with elegant UI design and mobile-responsive layout.',
                tech: ['Shopify', 'CSS'],
                link: 'https://www.bagx.pk/'
            },
            'proj3': {
                title: 'Shop Manto',
                img: 'landing/img/ne.jpg',
                desc: 'Modern clothing brand store with dynamic collections and fast loading speed.',
                tech: ['Shopify', 'JavaScript'],
                link: 'https://www.shopmanto.com/'
            },
            'proj4': {
                title: 'Sports Plus',
                img: 'landing/img/sport.png',
                desc: 'Sports equipment e-commerce platform with categorized listings and secure payments.',
                tech: ['Shopify', 'HTML'],
                link: 'https://www.sportsplus.pk/'
            },
            'proj5': {
                title: 'Oxford',
                img: 'landing/img/ox.jpg',
                desc: 'Educational and lifestyle store with clean navigation and professional branding.',
                tech: ['Shopify', 'CSS'],
                link: 'https://www.oxford.com.pk/'
            },
            'proj6': {
                title: 'Synthetix Nexus',
                img: 'landing/img/land.png',
                desc: 'High-tech landing page with futuristic design elements and smooth animations.',
                tech: ['React', 'Tailwind'],
                link: 'https://synthetix-nexus-landing-page.netlify.app/'
            },
            'proj7': {
                title: 'Coffee Business',
                img: 'landing/img/cof.jpg',
                desc: 'A warm and inviting website for a coffee shop business featuring menu and location details.',
                tech: ['HTML', 'CSS'],
                link: 'https://cofee-busniess-website.netlify.app/'
            },
            'proj8': {
                title: 'Vertex Business',
                img: 'landing/img/la.png',
                desc: 'Corporate business website layout with professional services showcase.',
                tech: ['HTML', 'JavaScript'],
                link: 'https://vertex-busniess-websites.netlify.app/'
            },
            'proj9': {
                title: 'Vortex Nexus',
                img: 'landing/img/l.png',
                desc: 'Dynamic landing page with vortex-themed visuals and call-to-action sections.',
                tech: ['HTML', 'CSS'],
                link: 'https://vortex-nexus-landing-page.netlify.app/'
            },
            'proj10': {
                title: 'Nexus Landing PG',
                img: 'landing/img/p.png',
                desc: 'Minimalist landing page focused on conversion and clean typography.',
                tech: ['HTML', 'JavaScript'],
                link: 'https://nexus-landing-pg.netlify.app/'
            },
            'proj11': {
                title: 'Lumina',
                img: 'landing/img/lum.jpg',
                desc: 'Unique branding project with stellar design aesthetics and playful colors.',
                tech: ['React', 'CSS'],
                link: 'https://stellular-tapioca-a3c4e5.netlify.app/'
            },
            'proj12': {
                title: 'Turbo Motors',
                img: 'landing/img/tur.jpg',
                desc: 'Creative portfolio layout with expressive typography and grid layouts.',
                tech: ['HTML', 'CSS'],
                link: 'https://loquacious-yeot-891ba3.netlify.app/'
            },
            'proj13': {
                title: 'Burger & Bite',
                img: 'landing/img/burg.jpg',
                desc: 'Elegant floral-themed website with soft colors and smooth transitions.',
                tech: ['HTML', 'JavaScript'],
                link: 'https://reliable-begonia-dcd41e.netlify.app/'
            },
            'proj14': {
                title: 'Result Generator',
                img: 'landing/img/gen.png',
                desc: 'Functional web app to generate and format student results dynamically.',
                tech: ['JavaScript', 'DOM'],
                link: 'https://student-result-generator.netlify.app/'
            },
            'proj16': {
                title: 'Shah Securities',
                img: 'landing/img/shah.jpg',
                desc: 'Financial services website with stock market updates and professional layout.',
                tech: ['HTML', 'CSS'],
                link: 'https://shah-securities-websites.netlify.app/'
            }
        };

        function openModal(projId) {
            const modal = document.getElementById('projectModal');
            const modalBody = document.getElementById('modalBody');
            const data = projectsData[projId];

            if(data) {
                modalBody.innerHTML = `
                    <img src="${data.img}" class="w-full h-72 object-cover rounded-xl mb-8 shadow-lg" alt="${data.title}">
                    <h2 class="text-3xl font-bold text-white mb-4">${data.title}</h2>
                    <p class="text-gray-300 mb-8 leading-relaxed text-lg">${data.desc}</p>
                    <div class="mb-8">
                        <h4 class="text-white font-semibold mb-4 text-lg">Technologies Used:</h4>
                        <div class="flex flex-wrap gap-3">
                            ${data.tech.map(t => `<span class="bg-indigo-500/20 text-indigo-300 px-4 py-2 rounded-full text-sm border border-indigo-500/30">${t}</span>`).join('')}
                        </div>
                    </div>
                    <div class="flex gap-4">
                        <a href="${data.link}" target="_blank" class="btn-primary inline-flex items-center gap-2">Live Demo <i class="fas fa-external-link-alt"></i></a>
                        <a href="#" class="px-8 py-3.5 rounded-full border border-white/20 hover:bg-white/10 transition-all text-white font-semibold inline-flex items-center gap-2">Code <i class="fab fa-github"></i></a>
                    </div>
                `;
                modal.classList.add('active');
            }
        }

        function closeModal() {
            document.getElementById('projectModal').classList.remove('active');
        }

        window.onclick = function(event) {
            const sModal = document.getElementById('serviceModal');
            const pModal = document.getElementById('projectModal');
            if (event.target == sModal) closeServiceModal();
            if (event.target == pModal) closeModal();
        }

        function filterProjects(category) {
            const items = document.querySelectorAll('.project-item');
            const buttons = document.querySelectorAll('.filter-btn');
            
            // Update button styles
            buttons.forEach(btn => {
                btn.classList.remove('bg-indigo-500', 'text-white', 'border-indigo-500');
                btn.classList.add('border-white/10', 'hover:border-indigo-500/50');
                if(btn.textContent.toLowerCase().includes(category) || (category === 'all' && btn.textContent.includes('All'))) {
                    btn.classList.add('bg-indigo-500', 'text-white', 'border-indigo-500');
                    btn.classList.remove('border-white/10');
                }
            });

            items.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'block';
                    // Re-trigger animation
                    item.classList.remove('aos-animate');
                    setTimeout(() => item.classList.add('aos-animate'), 50);
                } else {
                    item.style.display = 'none';
                }
            });
        }

        function loadMoreProjects() {
            const btn = document.getElementById('exploreBtn');
            const hiddenItems = document.querySelectorAll('.hidden-project');
            
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            
            setTimeout(() => {
                hiddenItems.forEach(item => {
                    item.style.display = 'block';
                    item.classList.add('aos-animate');
                });
                btn.style.display = 'none';
                AOS.refresh();
            }, 1000);
        }

        function toggleFaq(element) {
            const answer = element.querySelector('div.hidden, div.block');
            const icon = element.querySelector('i');
            
            if (answer.classList.contains('hidden')) {
                answer.classList.remove('hidden');
                answer.classList.add('block');
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
                icon.style.transform = 'rotate(180deg)';
            } else {
                answer.classList.add('hidden');
                answer.classList.remove('block');
                icon.classList.add('fa-plus');
                icon.classList.remove('fa-minus');
                icon.style.transform = 'rotate(0deg)';
            }
        }

        function sendToWhatsApp(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            const phoneNumber = "923113844483"; 
            
            const text = `*New Portfolio Inquiry*%0A%0A*Name:* ${name}%0A*Email:* ${email}%0A*Subject:* ${subject}%0A*Message:* ${message}`;
            
            const url = `https://wa.me/${phoneNumber}?text=${text}`;
            
            window.open(url, '_blank');
        }

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
                if(!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            });
        });

        window.addEventListener('scroll', () => {
            const nav = document.getElementById('navbar');
            if (window.scrollY > 50) {
                nav.classList.add('bg-black/90', 'shadow-lg');
                nav.classList.remove('bg-black/80');
            } else {
                nav.classList.remove('bg-black/90', 'shadow-lg');
                nav.classList.add('bg-black/80');
            }
        });