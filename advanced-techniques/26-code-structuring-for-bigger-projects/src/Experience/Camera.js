import Experience from './Experience'
export default class Camera {
  constructor() {
    this.experience = new Experience()
    this.sizes = this.experience.size
    this.canvas = this.experience.canvas
    
  }
}
