import { Injectable } from '@angular/core'

@Injectable()
export class FavoriteService {
  type = 'chart'

  constructor() {}

  setType(type) {
    this.type = type
  }

  getType() {
    return this.type
  }
}
