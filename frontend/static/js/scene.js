// NEW FUNCTION: Handle forest overlay button with error protection
function setupForestOverlayButton() {
    try {
        const forestButton = document.querySelector('#forest-overlay #toggle-content'); // Updated selector to match HTML
        if (!forestButton) {
            console.warn('Forest button not found');
            return;
        }

        forestButton.addEventListener('click', function(e) {
            try {
                e.stopPropagation();
                e.preventDefault();

                const forestOverlay = document.getElementById('forest-overlay');
                const newContent = document.getElementById('new-content');
                if (!forestOverlay || !newContent) return;

                // Hide forest overlay
                forestOverlay.classList.remove('visible');

                // Show new content overlay
                newContent.style.display = 'block';
                setTimeout(() => {
                    newContent.classList.add('visible');
                }, 10);
            } catch (error) {
                console.error('Forest button click handler error:', error);
            }
        });
    } catch (error) {
        console.error('Forest overlay setup error:', error);
    }
}

// Safe orbit parsing with defaults
function safeParseOrbit(orbitStr) {
    try {
        const parts = (orbitStr || '0deg 75deg 10m').split(' ');
        return {
            theta: parseFloat(parts[0]) || 0,
            phi: parseFloat(parts[1]) || 75,
            radius: parseFloat(parts[2]) || 10
        };
    } catch (error) {
        console.warn('Invalid orbit string, using defaults:', orbitStr);
        return { theta: 0, phi: 75, radius: 10 };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        // Elements with null checks
        const modelViewer = document.querySelector('#model-container');
        const loadingOverlay = document.getElementById('loading-overlay');
        const progressFill = document.getElementById('progress-fill');
        const featureCard = document.getElementById('feature-card');
        const featureTitle = document.getElementById('feature-title');
        const featureDesc = document.getElementById('feature-description');
        
        // Check if required elements exist
        if (!modelViewer || !loadingOverlay || !progressFill || !featureCard) {
            console.error('Required elements missing:', {
                modelViewer: !!modelViewer,
                loadingOverlay: !!loadingOverlay,
                progressFill: !!progressFill,
                featureCard: !!featureCard
            });
            return;
        }

// Model loaded handler with protection
function handleModelLoad() {
    try {
        console.log('Model fully loaded');
        
        // Set initial camera position
        modelViewer.cameraOrbit = '0deg 75deg 10m';
        modelViewer.fieldOfView = '30deg';
        modelViewer.updateFraming();
        
        // Hide loading overlay
        if (loadingOverlay.style) {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                if (loadingOverlay.style) {
                    loadingOverlay.style.display = 'none';
                }
            }, 500);
        }

        // Initialize overlay button events after load
        // Ensure the forest button exists before setting up
        const forestButton = document.querySelector('#forest-overlay #toggle-content');
        if (!forestButton) {
            console.warn('Forest button not found during model load');
        } else {
            setupForestOverlayButton();
        }
    } catch (error) {
        console.error('Model load handler error:', error);
    }
}

        // Model loading progress
        function handleProgress(event) {
            try {
                const progress = event.detail.totalProgress * 100;
                if (progressFill.style) {
                    progressFill.style.width = `${progress}%`;
                }
            } catch (error) {
                console.error('Progress handler error:', error);
            }
        }

        // Model error handler
        function handleModelError(e) {
            try {
                console.error('Model loading error:', e.detail);
                if (loadingOverlay) {
                    loadingOverlay.innerHTML = `
                        <h2>Error Loading Model</h2>
                        <p>Could not load the 3D model. Please try again later.</p>
                        <button onclick="window.location.reload()" style="
                            margin-top: 20px;
                            padding: 8px 16px;
                            background: #a78bfa;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                        ">Reload</button>
                    `;
                }
            } catch (error) {
                console.error('Error handler error:', error);
            }
        }

        // Add event listeners
        modelViewer.addEventListener('load', handleModelLoad);
        modelViewer.addEventListener('progress', handleProgress);
        modelViewer.addEventListener('error', handleModelError);

        // Annotation data
        const annotations = {
            tree: {
                title: "Ancient Oak",
                description: "This thousand-year-old tree is said to whisper secrets to those who listen carefully at dawn. Its bark glows faintly under moonlight."
            },
            waterfall: {
                title: "Crystal Falls",
                description: "The waters here contain rare minerals that give them healing properties. Local fairies are known to bathe here during full moons."
            },
            forest: {
                title: "Enchanted Forest",
                description: "A mystical forest filled with ancient secrets and magical creatures. The heart of the forest holds untold stories."
            }
        };

        // Handle annotation clicks with protection
        document.querySelectorAll('[slot^="hotspot-"]').forEach(hotspot => {
            try {
                const target = hotspot.getAttribute('slot').split('-')[1];
                
                if (!annotations[target]) {
                    console.warn(`No annotation data found for target: ${target}`);
                    return;
                }
                
                hotspot.addEventListener('click', (e) => {
                    try {
                        e.stopPropagation();
                        
                        // Update feature card if elements exist
                        if (featureTitle) featureTitle.textContent = annotations[target].title;
                        if (featureDesc) featureDesc.textContent = annotations[target].description;
                        
                        if (featureCard.style) {
                            featureCard.style.display = 'block';
                            featureCard.style.animation = 'fadeIn 0.3s ease-out';
                        }
                        
                        // Focus camera on the point
                        const position = hotspot.getAttribute('data-position');
                        if (position) {
                            const coords = position.split(' ').map(Number);
                            modelViewer.cameraOrbit = `${
                                Math.atan2(coords[0], coords[2]) * (180/Math.PI)
                            }deg 75deg 8m`;
                        }
                    } catch (error) {
                        console.error('Hotspot click handler error:', error);
                    }
                });
            } catch (error) {
                console.error('Hotspot setup error:', error);
            }
        });

        // Close feature card when clicking outside
        document.addEventListener('click', (e) => {
            try {
                if (featureCard && !featureCard.contains(e.target) && featureCard.style) {
                    featureCard.style.display = 'none';
                }
            } catch (error) {
                console.error('Click outside handler error:', error);
            }
        });

        // Handle window resize with debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            try {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    modelViewer.updateFraming();
                }, 100);
            } catch (error) {
                console.error('Resize handler error:', error);
            }
        });

    } catch (error) {
        console.error('Initialization error:', error);
    }
});