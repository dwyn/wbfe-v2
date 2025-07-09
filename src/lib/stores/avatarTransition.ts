// src/lib/stores/avatarTransition.ts
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
  }
  
  async transitionToBlog() {
    if (!browser || !this.homeAvatar) return;
    
    console.log('Starting transition to blog');
    
    // Create clone at home position
    const homeRect = this.homeAvatar.getBoundingClientRect();
    this.transitionClone = this.createClone(this.homeAvatar, homeRect);
    
    // Hide original
    this.homeAvatar.style.opacity = '0';
    
    // Calculate blog position (adjust these values based on your layout)
    const blogX = window.innerWidth / 2 - 200;
    const blogY = 100;
    const scaleRatio = 80 / 144; // blog size / home size
    
    // Animate clone to blog position
    await gsap.to(this.transitionClone, {
      x: blogX - homeRect.left,
      y: blogY - homeRect.top,
      scale: scaleRatio,
      duration: 0.6,
      ease: "power2.inOut"
    });
    
    // Cleanup
    this.cleanup();
  }
  
  async transitionToHome() {
    if (!browser || !this.blogAvatar) return;
    
    console.log('Starting transition to home');
    
    // Create clone at blog position
    const blogRect = this.blogAvatar.getBoundingClientRect();
    this.transitionClone = this.createClone(this.blogAvatar, blogRect);
    
    // Hide original
    this.blogAvatar.style.opacity = '0';
    
    // Calculate home position (adjust these values based on your layout)
    const homeX = window.innerWidth / 2 + 100;
    const homeY = 150;
    const scaleRatio = 144 / 80; // home size / blog size
    
    // Animate clone to home position
    await gsap.to(this.transitionClone, {
      x: homeX - blogRect.left,
      y: homeY - blogRect.top,
      scale: scaleRatio,
      duration: 0.6,
      ease: "power2.inOut"
    });
    
    // Cleanup
    this.cleanup();
  }
  
  private createClone(source: HTMLElement, rect: DOMRect): HTMLElement {
    const clone = source.cloneNode(true) as HTMLElement;
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
    
    // Show originals
    if (this.homeAvatar) {
      this.homeAvatar.style.opacity = '';
    }
    if (this.blogAvatar) {
      this.blogAvatar.style.opacity = '';
    }
  }
}

export const avatarManager = AvatarTransitionManager.getInstance();
