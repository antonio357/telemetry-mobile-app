import {Dimensions} from 'react-native';


export class CanvasDimensions {
  // card para o canvas
  screen = { height: Dimensions.get('window').height, width: Dimensions.get('window').width };
  cardHorizontalMargin = 48;
  card = { height: 400, width: this.screen.width - this.cardHorizontalMargin };
  cardText = { height: 24, width: this.card.width - 20, fontSize: 12 };
  canvasHorizontalMargin = 20;

  // canvas
  canvasDimensions = { height: this.card.height - this.cardText.height, width: this.card.width - this.canvasHorizontalMargin };
  xy0pointDimensions = { height: 10, width: 10 };
  yAxisDimensions = { height: this.canvasDimensions.height - this.xy0pointDimensions.height, width: this.xy0pointDimensions.width };
  xAxisDimensions = { height: this.xy0pointDimensions.height, width: this.canvasDimensions.width };
  lineDrawDimensios = { height: this.canvasDimensions - this.xy0pointDimensions.height, width: this.canvasDimensions - this.xy0pointDimensions.width };

  // drowpoints limits
  lineDrawPoints = {
    leftBottom: { x: this.xy0pointDimensions.width, y: this.xy0pointDimensions.height },
    leftTop: { x: this.xy0pointDimensions.width, y: this.canvasDimensions.height },
    rightTop: { x: this.canvasDimensions.width, y: this.canvasDimensions.height },
    rightBottom: { x: this.canvasDimensions.width, y: this.xy0pointDimensions.height }
  }
  yAxisDrawPoints = {
    leftBottom: { x: 0, y: this.xy0pointDimensions.height },
    leftTop: { x: 0, y: this.canvasDimensions.height },
    rightTop: { x: this.xy0pointDimensions.width, y: this.canvasDimensions.height },
    rightBottom: { x: this.xy0pointDimensions.width, y: this.xy0pointDimensions.height }
  }
  xAxisDrawPoints = {
    leftBottom: { x: this.xy0pointDimensions.width, y: 0 },
    leftTop: { x: this.xy0pointDimensions.width, y: this.xy0pointDimensions.height },
    rightTop: { x: this.canvasDimensions.width, y: this.xy0pointDimensions.height },
    rightBottom: { x: this.canvasDimensions.width, y: 0 }
  }
}