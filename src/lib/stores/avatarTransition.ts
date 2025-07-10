import { writable } from 'svelte/store';
import { gsap } from 'gsap';
import { browser } from '$app/environment';

interface AvatarState {
  isTransitioning: boolean;
  fromRoute: string;
  toRoute: string;
}

export const avatarTransition = writable<AvatarState>({
  isTransitioning: false,
  fromRoute: '',
  toRoute: ''
});

class AvatarTransitionManager {
  private static instance: AvatarTransitionManager;
  private homeAvatar: HTMLElement | null = null;
  private blogAvatar: HTMLElement | null = null;
  private transitionClone: HTMLElement | null = null;
  private targetPositionResolver: ((position: DOMRect) => void) | null = null;
  
  static getInstance() {
    if (!AvatarTransitionManager.instance) {
      AvatarTransitionManager.instance = new AvatarTransitionManager();
    }
    return AvatarTransitionManager.instance;
  }
  
  registerHomeAvatar(element: HTMLElement) {
    this.homeAvatar = element;
    console.log('Home avatar registered:', element);
  }
  
  registerBlogAvatar(element: HTMLElement) {
    this.blogAvatar = element;
    console.log('Blog avatar registered:', element);
    
    // If we were waiting for the blog avatar position, resolve it
    if (this.targetPositionResolver) {
      const rect = element.getBoundingClientRect();
      this.targetPositionResolver(rect);
      this.targetPositionResolver = null;
    }
  }
  
  async transitionToBlog() {
    if (!browser || !this.homeAvatar) return;
    
    console.log('Starting transition to blog');
    
    // Create clone at home position
    const homeRect = this.homeAvatar.getBoundingClientRect();
    this.transitionClone = this.createClone(this.homeAvatar, homeRect);
    
    // Hide original immediately
    gsap.set(this.homeAvatar, { opacity: 0 });
    
    // Wait a frame to ensure the blog page starts rendering
    await new Promise(resolve => requestAnimationFrame(resolve));
    
    // Wait for the blog avatar to be registered and get its position
    const targetRect = await this.waitForTargetPosition('blog');
    
    if (!targetRect || !this.transitionClone) {
      this.cleanup();
      return;
    }
    
    // Calculate the transform needed
    const scaleX = targetRect.width / homeRect.width;
    const scaleY = targetRect.height / homeRect.height;
    const deltaX = targetRect.left - homeRect.left;
    const deltaY = targetRect.top - homeRect.top;
    
    // Animate clone to exact blog position
    await gsap.to(this.transitionClone, {
      x: deltaX,
      y: deltaY,
      scaleX: scaleX,
      scaleY: scaleY,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        // Show the blog avatar just before removing the clone
        if (this.blogAvatar) {
          gsap.set(this.blogAvatar, { opacity: 1 });
        }
      }
    });
    
    // Small delay to ensure smooth visual transition
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Cleanup
    this.cleanup();
  }
  
  async transitionToHome() {
    if (!browser || !this.blogAvatar) return;
    
    console.log('Starting transition to home');
    
    // Create clone at blog position
    const blogRect = this.blogAvatar.getBoundingClientRect();
    this.transitionClone = this.createClone(this.blogAvatar, blogRect);
    
    // Hide original immediately
    gsap.set(this.blogAvatar, { opacity: 0 });
    
    // Wait a frame to ensure the home page starts rendering
    await new Promise(resolve => requestAnimationFrame(resolve));
    
    // Wait for the home avatar to be registered and get its position
    const targetRect = await this.waitForTargetPosition('home');
    
    if (!targetRect || !this.transitionClone) {
      this.cleanup();
      return;
    }
    
    // Calculate the transform needed
    const scaleX = targetRect.width / blogRect.width;
    const scaleY = targetRect.height / blogRect.height;
    const deltaX = targetRect.left - blogRect.left;
    const deltaY = targetRect.top - blogRect.top;
    
    // Animate clone to exact home position
    await gsap.to(this.transitionClone, {
      x: deltaX,
      y: deltaY,
      scaleX: scaleX,
      scaleY: scaleY,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        // Show the home avatar just before removing the clone
        if (this.homeAvatar) {
          gsap.set(this.homeAvatar, { opacity: 1 });
        }
      }
    });
    
    // Small delay to ensure smooth visual transition
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Cleanup
    this.cleanup();
  }
  
  private async waitForTargetPosition(target: 'home' | 'blog'): Promise<DOMRect | null> {
    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max wait
      
      const checkForAvatar = () => {
        attempts++;
        
        const avatar = target === 'home' ? this.homeAvatar : this.blogAvatar;
        
        if (avatar && avatar.offsetParent !== null) {
          // Avatar exists and is visible
          const rect = avatar.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            resolve(rect);
            return;
          }
        }
        
        if (attempts < maxAttempts) {
          setTimeout(checkForAvatar, 100);
        } else {
          console.warn(`Timeout waiting for ${target} avatar`);
          resolve(null);
        }
      };
      
      checkForAvatar();
    });
  }
  
  private createClone(source: HTMLElement, rect: DOMRect): HTMLElement {
    const clone = source.cloneNode(true) as HTMLElement;
    
    // Remove any transform from the source that might affect the clone
    const computedStyle = window.getComputedStyle(source);
    const matrix = new DOMMatrix(computedStyle.transform);
    
    clone.style.cssText = `
      position: fixed;
      left: ${rect.left}px;
      top: ${rect.top}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      z-index: 10000;
      pointer-events: none;
      margin: 0;
      transform-origin: top left;
      transform: none;
    `;
    clone.classList.add('avatar-clone');
    document.body.appendChild(clone);
    return clone;
  }
  
  private cleanup() {
    if (this.transitionClone) {
      this.transitionClone.remove();
      this.transitionClone = null;
    }
    
    // Reset any inline styles
    if (this.homeAvatar) {
      this.homeAvatar.style.opacity = '';
    }
    if (this.blogAvatar) {
      this.blogAvatar.style.opacity = '';
    }
  }
  
  // Call this when navigation is complete to ensure avatars are visible
  ensureAvatarsVisible() {
    if (this.homeAvatar) {
      this.homeAvatar.style.opacity = '';
    }
    if (this.blogAvatar) {
      this.blogAvatar.style.opacity = '';
    }
  }
}

export const avatarManager = AvatarTransitionManager.getInstance();
