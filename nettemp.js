
let logger = 1

window.addEventListener('DOMContentLoaded', (event) => {
    window.setTimeout(function () {

        let canvas
        let canvas_context
        let keysPressed = {}
        function setUp(canvas_pass, style = "#000000") {
            canvas = canvas_pass
            canvas_context = canvas.getContext('2d');
            canvas_context.imageSmoothingEnabled = false
            canvas.style.background = style
            window.setInterval(function () {
                main()
            }, 1)

            document.addEventListener('keydown', (event) => {
                keysPressed[event.key] = true;
                // logger = 1
            });
            document.addEventListener('keyup', (event) => {
                delete keysPressed[event.key];
                // logger = 0

                logger = 1
            });
        }
        function getRandomColor() { // random color
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[(Math.floor(Math.random() * 16) + 0)];
            }
            return color;
        }

        let setup_canvas = document.getElementById('canvas') //getting canvas from document
        setUp(setup_canvas) // setting up canvas refrences, starting timer. 


        class Circle {
            constructor(x, y, radius, color, xmom = 0, ymom = 0, friction = 1, reflect = 0, strokeWidth = 0, strokeColor = "transparent") {
                this.x = x
                this.y = y
                this.radius = radius
                this.color = color
                this.xmom = xmom
                this.ymom = ymom
                this.friction = friction
                this.reflect = reflect
                this.strokeWidth = strokeWidth
                this.strokeColor = strokeColor
            }
            draw() {
                canvas_context.lineWidth = this.strokeWidth
                canvas_context.strokeStyle = this.color
                canvas_context.beginPath();
                if (this.radius > 0) {
                    canvas_context.arc(this.x, this.y, this.radius, 0, (Math.PI * 2), true)
                    canvas_context.fillStyle = this.color
                    canvas_context.fill()
                    canvas_context.stroke();
                } else {
                    console.log("The circle is below a radius of 0, and has not been drawn. The circle is:", this)
                }
            }
            move() {
                if (this.reflect == 1) {
                    if (this.x + this.radius > canvas.width) {
                        if (this.xmom > 0) {
                            this.xmom *= -1
                        }
                    }
                    if (this.y + this.radius > canvas.height) {
                        if (this.ymom > 0) {
                            this.ymom *= -1
                        }
                    }
                    if (this.x - this.radius < 0) {
                        if (this.xmom < 0) {
                            this.xmom *= -1
                        }
                    }
                    if (this.y - this.radius < 0) {
                        if (this.ymom < 0) {
                            this.ymom *= -1
                        }
                    }
                }
                this.x += this.xmom
                this.y += this.ymom
            }
            unmove() {
                if (this.reflect == 1) {
                    if (this.x + this.radius > canvas.width) {
                        if (this.xmom > 0) {
                            this.xmom *= -1
                        }
                    }
                    if (this.y + this.radius > canvas.height) {
                        if (this.ymom > 0) {
                            this.ymom *= -1
                        }
                    }
                    if (this.x - this.radius < 0) {
                        if (this.xmom < 0) {
                            this.xmom *= -1
                        }
                    }
                    if (this.y - this.radius < 0) {
                        if (this.ymom < 0) {
                            this.ymom *= -1
                        }
                    }
                }
                this.x -= this.xmom
                this.y -= this.ymom
            }
            frictiveMove() {
                if (this.reflect == 1) {
                    if (this.x + this.radius > canvas.width) {
                        if (this.xmom > 0) {
                            this.xmom *= -1
                        }
                    }
                    if (this.y + this.radius > canvas.height) {
                        if (this.ymom > 0) {
                            this.ymom *= -1
                        }
                    }
                    if (this.x - this.radius < 0) {
                        if (this.xmom < 0) {
                            this.xmom *= -1
                        }
                    }
                    if (this.y - this.radius < 0) {
                        if (this.ymom < 0) {
                            this.ymom *= -1
                        }
                    }
                }
                this.x += this.xmom
                this.y += this.ymom
                this.xmom *= this.friction
                this.ymom *= this.friction
            }
            frictiveunMove() {
                if (this.reflect == 1) {
                    if (this.x + this.radius > canvas.width) {
                        if (this.xmom > 0) {
                            this.xmom *= -1
                        }
                    }
                    if (this.y + this.radius > canvas.height) {
                        if (this.ymom > 0) {
                            this.ymom *= -1
                        }
                    }
                    if (this.x - this.radius < 0) {
                        if (this.xmom < 0) {
                            this.xmom *= -1
                        }
                    }
                    if (this.y - this.radius < 0) {
                        if (this.ymom < 0) {
                            this.ymom *= -1
                        }
                    }
                }
                this.xmom /= this.friction
                this.ymom /= this.friction
                this.x -= this.xmom
                this.y -= this.ymom
            }
            isPointInside(point) {
                this.areaY = point.y - this.y
                this.areaX = point.x - this.x
                if (((this.areaX * this.areaX) + (this.areaY * this.areaY)) <= (this.radius * this.radius)) {
                    return true
                }
                return false
            }
            doesPerimeterTouch(point) {
                this.areaY = point.y - this.y
                this.areaX = point.x - this.x
                if (((this.areaX * this.areaX) + (this.areaY * this.areaY)) <= ((this.radius + point.radius) * (this.radius + point.radius))) {
                    return true
                }
                return false
            }
        }
        class Polygon {
            constructor(x, y, size, color, sides = 3, xmom = 0, ymom = 0, angle = 0, reflect = 0) {
                if (sides < 2) {
                    sides = 2
                }
                this.reflect = reflect
                this.xmom = xmom
                this.ymom = ymom
                this.body = new Circle(x, y, size - (size * .293), "transparent")
                this.nodes = []
                this.angle = angle
                this.size = size
                this.color = color
                this.angleIncrement = (Math.PI * 2) / sides
                this.sides = sides
                for (let t = 0; t < sides; t++) {
                    let node = new Circle(this.body.x + (this.size * (Math.cos(this.angle))), this.body.y + (this.size * (Math.sin(this.angle))), 0, "transparent")
                    this.nodes.push(node)
                    this.angle += this.angleIncrement
                }
            }
            isPointInside(point) { // rough approximation
                this.body.radius = this.size - (this.size * .293)
                if (this.sides <= 2) {
                    return false
                }
                this.areaY = point.y - this.body.y
                this.areaX = point.x - this.body.x
                if (((this.areaX * this.areaX) + (this.areaY * this.areaY)) <= (this.body.radius * this.body.radius)) {
                    return true
                }
                return false
            }
            move() {
                if (this.reflect == 1) {
                    if (this.body.x > canvas.width) {
                        if (this.xmom > 0) {
                            this.xmom *= -1
                        }
                    }
                    if (this.body.y > canvas.height) {
                        if (this.ymom > 0) {
                            this.ymom *= -1
                        }
                    }
                    if (this.body.x < 0) {
                        if (this.xmom < 0) {
                            this.xmom *= -1
                        }
                    }
                    if (this.body.y < 0) {
                        if (this.ymom < 0) {
                            this.ymom *= -1
                        }
                    }
                }
                this.body.x += this.xmom
                this.body.y += this.ymom
            }
            draw() {
                this.nodes = []
                this.angleIncrement = (Math.PI * 2) / this.sides
                this.body.radius = this.size - (this.size * .293)
                for (let t = 0; t < this.sides; t++) {
                    let node = new Circle(this.body.x + (this.size * (Math.cos(this.angle))), this.body.y + (this.size * (Math.sin(this.angle))), 0, "transparent")
                    this.nodes.push(node)
                    this.angle += this.angleIncrement
                }
                canvas_context.strokeStyle = this.color
                canvas_context.fillStyle = this.color
                canvas_context.lineWidth = 0
                canvas_context.beginPath()
                canvas_context.moveTo(this.nodes[0].x, this.nodes[0].y)
                for (let t = 1; t < this.nodes.length; t++) {
                    canvas_context.lineTo(this.nodes[t].x, this.nodes[t].y)
                }
                canvas_context.lineTo(this.nodes[0].x, this.nodes[0].y)
                canvas_context.fill()
                canvas_context.stroke()
                canvas_context.closePath()
            }
        }
        class Perceptron {
            constructor(inputs, layer, outputcount = 0) {
                this.inputs = [...inputs]
                this.weights = []
                this.bias = 0 // (Math.random() - .5) * 10
                for (let t = 0; t < this.inputs.length; t++) {
                    this.weights.push(this.weight())
                }
                this.value = this.compute()
                this.error = 0
                // if(Math.random()<.1){
                //     this.dropped = Math.floor(Math.random()*2)
                // }else{
                //     this.dropped = 0
                // }
                this.dropped = 0
                this.momentum = .0010 // 0.001
                this.gradient = .001 //Math.random()
                this.layer = layer
                this.biasMomentum = .0010//.001
                this.biasGradient = .0010//.001
                this.outputWeightsIndex = Array(outputcount);
            }
            compute() {
                let value = this.bias
                for (let t = 0; t < this.inputs.length; t++) {
                    value += this.inputs[t] * this.weights[t]
                }
                this.net = value
                return this.lognormalize(value)
            }
            lognormalize(output) {
                return (1 / (1 + Math.pow(Math.E, (output * -1))))
            }
            weight() {
                // return 1
                return (Math.random() - .5) * 2
            }
            clone(inputs) {
                let clone = new Perceptron(inputs, this.layer, this.outputWeightsIndex)
                clone.inputs = [...inputs]
                clone.weights = [...this.weights]
                clone.bias = this.bias
                clone.value = clone.compute()
                clone.biasMomentum = this.biasMomentum
                clone.gradient = this.gradient
                clone.biasGradient = this.biasGradient
                clone.momentum = this.momentum
                return clone
            }
            mutate() {
                for (let t = 0; t < this.weights.length; t++) {
                    if (Math.random() < mutationrate) {
                        this.weights[t] += (.2 * (Math.random() - .5))
                    }
                    if (Math.random() < mutationrate) {
                        this.weights[t] *= -1
                    }
                    if (Math.random() < mutationrate) {
                        this.weights[t] *= 0
                    }
                    if (Math.random() < mutationrate) {
                        this.weights[t] = this.weight()
                    }
                    if (Math.random() < mutationrate) {
                        this.weights[t] *= 1 + ((Math.random() - .5) * .5)
                    }
                }

                if (Math.random() < mutationrate) {
                    this.bias = (Math.random() - .5) * 1
                }
                if (Math.random() < mutationrate) {
                    this.bias += (.1 * (Math.random() - .5))
                }
                if (Math.random() < mutationrate) {
                    this.bias *= 1 + ((Math.random() - .5) * .5)
                }
                if (Math.random() < mutationrate) {
                    this.bias = 0
                }
                if (Math.random() < mutationrate) {
                    this.bias *= -1
                }
            }
            smallmutate() {
                for (let t = 0; t < this.weights.length; t++) {
                    if (Math.random() < mutationratesmall) {
                        this.weights[t] += (.2 * (Math.random() - .5))
                    }
                    if (Math.random() < mutationratesmall) {
                        this.weights[t] *= -1
                    }
                    if (Math.random() < mutationratesmall) {
                        // this.weights[t] *= 0
                    }
                    if (Math.random() < mutationratesmall) {
                        this.weights[t] = this.weight()
                    }
                    if (Math.random() < mutationratesmall) {
                        this.weights[t] *= 1 + ((Math.random() - .5) * .5)
                    }

                }
                if (Math.random() < mutationratesmall) {
                    this.bias = (Math.random() - .5) * 1
                }
                if (Math.random() < mutationratesmall) {
                    this.bias += (.02 * (Math.random() - .5))
                }
                if (Math.random() < mutationratesmall) {
                    this.bias *= 1 + ((Math.random() - .5) * .5)
                }
                if (Math.random() < mutationratesmall) {
                    // this.bias = 0
                }
                if (Math.random() < mutationratesmall) {
                    this.bias *= -1
                }
            }
            micromutate() {
                for (let t = 0; t < this.weights.length; t++) {
                    if (Math.random() < mutationratemicro) {
                        this.weights[t] += (.2 * (Math.random() - .5))
                    }
                    if (Math.random() < mutationratemicro) {
                        this.weights[t] *= -1
                    }
                    if (Math.random() < mutationratemicro) {
                        this.weights[t] *= 0
                    }
                    if (Math.random() < mutationratemicro) {
                        this.weights[t] = this.weight()
                    }
                    if (Math.random() < mutationratemicro) {
                        this.weights[t] *= 1 + ((Math.random() - .5) * .5)
                    }

                }
                // if (Math.random() < mutationratemicro) {
                //     this.bias = (Math.random() - .5) * 1
                // }
                // if (Math.random() < mutationratemicro) {
                //     this.bias += (.02 * (Math.random() - .5))
                // }
                // if (Math.random() < mutationratemicro) {
                //     this.bias *= 1 + ((Math.random() - .5) * .5)
                // }
                // if (Math.random() < mutationratemicro) {
                //     this.bias = 0
                // }
                // if (Math.random() < mutationratemicro) {
                //     this.bias *= -1
                // }
            }
            bigmutate() {
                for (let t = 0; t < this.weights.length; t++) {
                    if (Math.random() < mutationratebig) {
                        this.weights[t] += (.2 * (Math.random() - .5))
                    }
                    if (Math.random() < mutationratebig) {
                        this.weights[t] *= -1
                    }
                    if (Math.random() < mutationratebig) {
                        // this.weights[t] *= 0
                    }
                    if (Math.random() < mutationratebig) {
                        this.weights[t] = this.weight()
                    }
                    if (Math.random() < mutationratebig) {
                        this.weights[t] *= 1 + ((Math.random() - .5) * .5)
                    }

                }
                if (Math.random() < mutationratebig) {
                    this.bias = (Math.random() - .5) * 1
                }
                if (Math.random() < mutationratebig) {
                    this.bias += (.2 * (Math.random() - .5))
                }
                if (Math.random() < mutationratebig) {
                    this.bias *= 1 + ((Math.random() - .5) * .5)
                }
                if (Math.random() < mutationratebig) {
                    // this.bias = 0
                }
                if (Math.random() < mutationratebig) {
                    this.bias *= -1
                }
            }
        }

    class LineOP {
        constructor(object, target, color, width) {
            this.object = object
            this.target = target
            this.color = color
            this.width = width
        }
        hypotenuse() {
            let xdif = this.object.x - this.target.x
            let ydif = this.object.y - this.target.y
            let hypotenuse = (xdif * xdif) + (ydif * ydif)
            return Math.sqrt(hypotenuse)
        }
        draw() {
            let linewidthstorage = canvas_context.lineWidth
            canvas_context.strokeStyle = this.color
            canvas_context.lineWidth = this.width
            canvas_context.beginPath()
            canvas_context.moveTo(this.object.x, this.object.y)
            canvas_context.lineTo(this.target.x, this.target.y)
            canvas_context.stroke()
            canvas_context.lineWidth = linewidthstorage
        }
    }
        class GenNN {
            constructor(inputs, layercount, layersetupArray, outputs = 2, override = 0) {
                if (override == 0) {
                    this.name = getRandomColor()
                    this.fitness = 0
                    this.correct = 0
                    this.wrong = 0
                    this.parent = this.name
                    this.generation = 0
                    this.inputs = [...inputs]
                    this.layercount = layercount
                    this.layersetupArray = [...layersetupArray]
                    this.tempinputs = [...inputs]
                    this.structure = []
                    this.prev_momentum = 0
                    this.lr = .5
                    this.iterations = 1
                    // this.optimizer = "momentum"
                    this.optimizerParams = {}
                    this.optimizerParams.alpha = .005
                    this.optimizerParams.beta1 = .05
                    this.optimizerParams.beta2 = .15
                    this.gradients = []
                    this.adjustments = []
                    this.fed = 0
                    for (let t = 0; t < this.layercount; t++) {
                        let nodes = []
                        for (let k = 0; k < this.layersetupArray[t]; k++) {
                            if (typeof this.layersetupArray[t + 1] !== "undefined") {
                                let node = new Perceptron([...this.tempinputs], t, this.layersetupArray[t + 1])
                                nodes.push(node)
                            } else {
                                let node = new Perceptron([...this.tempinputs], t, 0)
                                nodes.push(node)
                            }
                        }
                        this.structure.push(nodes)
                        this.tempinputs = []
                        this.tempclone = []
                        for (let g = 0; g < this.structure[this.structure.length - 1].length; g++) {
                            this.tempinputs.push(this.structure[this.structure.length - 1][g].value)
                            this.tempclone.push(this.structure[this.structure.length - 1][g].value)
                        }
                        for (let n = 0; n < this.tempinputs.length; n++) {
                            this.tempinputs[n] = this.normalize(this.tempinputs[n], Math.min(...this.tempclone), Math.max(...this.tempclone)) //optional
                        }
                    }
                    this.outputs = this.layersetupArray[this.layersetupArray.length - 1]
                    this.outputMagnitudes = []
                    this.outputMagnitudesClone = []
                    this.outputMagnitudesCloneSpare = []
                    for (let t = 0; t < this.outputs; t++) {
                        this.outputMagnitudes.push(this.tempclone[t])
                        this.outputMagnitudesClone.push(this.tempclone[t])
                        this.outputMagnitudesCloneSpare.push(this.tempclone[t])
                    }

                    this.outputSum = 0
                    for (let t = 0; t < this.outputs; t++) {
                        this.outputMagnitudesClone[t] = this.normalize(this.outputMagnitudesClone[t], Math.min(...this.outputMagnitudesCloneSpare), Math.max(...this.outputMagnitudesCloneSpare))
                        // this.outputMagnitudesClone[t] = this.truenormalize(this.outputMagnitudesClone[t], Math.min(...this.outputMagnitudesCloneSpare), Math.max(...this.outputMagnitudesCloneSpare))
                    }
                    for (let t = 0; t < this.outputs; t++) {
                        this.outputMagnitudes[t] = this.normalize(this.outputMagnitudes[t], Math.min(...this.outputMagnitudesCloneSpare), Math.max(...this.outputMagnitudesCloneSpare))
                        this.outputMagnitudes[t] = this.truenormalize(this.outputMagnitudes[t], Math.min(...this.outputMagnitudesClone), Math.max(...this.outputMagnitudesClone))
                        this.outputSum += this.outputMagnitudes[t]
                    }
                    if (this.outputSum != 0) {
                        this.outputSum = 1 / this.outputSum
                    } else {
                        this.outputSum = 0
                    }
                    for (let t = 0; t < this.outputs; t++) {
                        this.outputMagnitudes[t] *= this.outputSum
                    }
                    this.outputcheck = 0
                    for (let t = 0; t < this.outputs; t++) {
                        this.outputcheck += this.outputMagnitudes[t]
                    }
                    if (this.outputcheck == 0) {
                        this.outputMagnitudes[this.outputMagnitudesCloneSpare.indexOf(Math.max(...this.outputMagnitudesCloneSpare))] = 1
                    }

                    this.r = 128 //Math.random()*255
                    this.g = 128 //Math.random()*255
                    this.b = 128 //Math.random()*255
                    this.name = `rgb(${this.r},${this.g},${this.b})`
                    this.dot = new Circle(350, 350, 2.7, `rgb(${this.r},${this.g},${this.b})`)
                } else {
                    console.log(override)
                    // this = override
                }
            }
            clone(x,y) {
                let clone = new GenNN(this.inputs, this.layercount, this.layersetupArray, 4)
                for (let t = 0; t < this.structure.length; t++) {
                    for (let k = 0; k < this.structure[t].length; k++) {
                        for (let p = 0; p < this.structure[t][k].weights.length; p++) {
                            clone.structure[t][k].weights[p] = this.structure[t][k].weights[p]
                            clone.structure[t][k].bias = this.structure[t][k].bias
                        }
                    }
                }
                clone.generation = this.generation + 1
                clone.r = this.r
                clone.g = this.g
                clone.b = this.b
                clone.parent = this.name
                clone.name = `rgb(${clone.r},${clone.g},${clone.b})`
                clone.dot.x = x
                clone.dot.y = y
                return clone
            }
            optimizeGradient(value, grad, momentum, gradients) {

                var p = this.optimizerParams
                this.prev_momentum = momentum;

                // Momentum helps to escape local minimums, 
                // Nesterov accelerated gradient is smarter than momentum because inertia is predicted
                // Adagrad aims to automatically decrease the learning rate 
                // Adadelta correct the too aggressive learning rate reduction of Adagrad

                switch (this.optimizer) {
                    case "momentum":
                        momentum = (1 - p.alpha) * this.lr * grad + p.alpha * momentum;
                        value += momentum;
                        break;

                    case "nag":
                        momentum = p.alpha * momentum + (1 - p.alpha) * this.lr * grad;
                        value += -p.alpha * prev_momentum + (1 + p.alpha) * momentum;
                        break;

                    case "adagrad":
                        gradients += grad * grad; // this contains the sum of all past squared gradients
                        value += this.lr * grad / (Math.sqrt(gradients) + _EPSILON);
                        break;

                    case "adadelta":
                        gradients = p.alpha * gradients + (1 - p.alpha) * grad * grad; // this contains the decaying average of all past squared gradients
                        value += this.lr * grad / (Math.sqrt(gradients) + _EPSILON);
                        break;

                    case "adam":
                        momentum = p.beta1 * momentum + (1 - p.beta1) * grad;
                        gradients = p.beta2 * gradients + (1 - p.beta2) * grad * grad;

                        var mt = momentum / (1 - Math.pow(p.beta1, this.iterations)); // momentum bias correction
                        var gt = gradients / (1 - Math.pow(p.beta2, this.iterations)); // gradients bias correction

                        value += this.lr * mt / (Math.sqrt(gt) + _EPSILON);
                        break;

                    default: // good-old vanilla SGD
                        value += this.lr * grad;
                }
                return { value: value, grad: grad, momentum: momentum, gradients: gradients };
            }
            static_reluDerivative(x) {
                return x < 0 ? 0 : x;
            };
            getNeuronsInLayer(target) {
                return [...this.structure[target]]
            }
            mutate() {
                this.r = Math.round(Math.max(Math.min((this.r + ((Math.random() - .5) * 16)), 255), 0))
                this.g = Math.round(Math.max(Math.min((this.g + ((Math.random() - .5) * 16)), 255), 0))
                this.b = Math.round(Math.max(Math.min((this.b + ((Math.random() - .5) * 16)), 255), 0))
                this.name = `rgb(${this.r},${this.g},${this.b})`
                for (let t = 0; t < this.structure.length; t++) {
                    for (let k = 0; k < this.structure[t].length; k++) {
                        this.structure[t][k].mutate()
                    }
                }
                this.changeInputs(this.inputs)
                this.dot.color = `rgb(${this.r},${this.g},${this.b})`
            }
            smallmutate() {
                this.r = Math.round(Math.max(Math.min((this.r + ((Math.random() - .5) * 10)), 255), 0))
                this.g = Math.round(Math.max(Math.min((this.g + ((Math.random() - .5) * 10)), 255), 0))
                this.b = Math.round(Math.max(Math.min((this.b + ((Math.random() - .5) * 10)), 255), 0))
                this.name = `rgb(${this.r},${this.g},${this.b})`
                for (let t = 0; t < this.structure.length; t++) {
                    for (let k = 0; k < this.structure[t].length; k++) {
                        this.structure[t][k].smallmutate()
                    }
                }
                this.changeInputs(this.inputs)
            }
            biasmutate() {
                for (let t = 0; t < this.structure.length; t++) {
                    for (let k = 0; k < this.structure[t].length; k++) {
                        this.structure[t][k].bias += (Math.random() - .5) * 1 //*12
                    }
                }
            }
            picomutate() {
                let str = Math.floor(Math.random() * this.structure.length)
                let ptr = Math.floor(Math.random() * this.structure[str].length)
                let wtr = Math.floor(Math.random() * this.structure[str][ptr].weights.length)
                this.structure[str][ptr].weights[wtr] = this.structure[str][ptr].weight()
            }
            micromutate() {

                this.r = Math.round(Math.max(Math.min((this.r + ((Math.random() - .5) * 4)), 255), 0))
                this.g = Math.round(Math.max(Math.min((this.g + ((Math.random() - .5) * 4)), 255), 0))
                this.b = Math.round(Math.max(Math.min((this.b + ((Math.random() - .5) * 4)), 255), 0))
                this.name = `rgb(${this.r},${this.g},${this.b})`
                for (let t = 0; t < this.structure.length; t++) {
                    for (let k = 0; k < this.structure[t].length; k++) {
                        this.structure[t][k].micromutate()
                    }
                }
                this.changeInputs(this.inputs)
            }
            bigmutate() {

                this.r = Math.round(Math.max(Math.min((this.r + ((Math.random() - .5) * 50)), 255), 0))
                this.g = Math.round(Math.max(Math.min((this.g + ((Math.random() - .5) * 50)), 255), 0))
                this.b = Math.round(Math.max(Math.min((this.b + ((Math.random() - .5) * 50)), 255), 0))
                this.name = `rgb(${this.r},${this.g},${this.b})`
                for (let t = 0; t < this.structure.length; t++) {
                    for (let k = 0; k < this.structure[t].length; k++) {
                        this.structure[t][k].bigmutate()
                    }
                }
                this.changeInputs(this.inputs)
            }
            changeInputs(inputs) {
                this.inputs = [...inputs]
                this.tempinputs = [...inputs]
                this.structureclone = []
                for (let t = 0; t < this.structure.length; t++) {
                    this.structureclone[t] = []
                    for (let k = 0; k < this.structure[t].length; k++) {
                        this.structureclone[t].push(this.structure[t][k].clone(this.tempinputs))
                    }
                    this.tempinputs = []
                    this.tempclone = []
                    for (let g = 0; g < this.structureclone[this.structureclone.length - 1].length; g++) {
                        this.tempinputs.push(this.structureclone[this.structureclone.length - 1][g].value)
                        this.tempclone.push(this.structureclone[this.structureclone.length - 1][g].value)
                    }
                    for (let n = 0; n < this.tempinputs.length; n++) {
                        this.tempinputs[n] = this.normalize(this.tempinputs[n], Math.min(...this.tempclone), Math.max(...this.tempclone))//optional
                    }
                }
                this.outputs = this.layersetupArray[this.layersetupArray.length - 1]
                this.outputMagnitudes = []
                this.outputMagnitudesClone = []
                this.outputMagnitudesCloneSpare = []
                for (let t = 0; t < this.outputs; t++) {
                    this.outputMagnitudes.push(this.tempclone[t])
                    this.outputMagnitudesClone.push(this.tempclone[t])
                    this.outputMagnitudesCloneSpare.push(this.tempclone[t])
                }
                this.outputSum = 0
                for (let t = 0; t < this.outputs; t++) {
                    this.outputMagnitudesClone[t] = this.normalize(this.outputMagnitudesClone[t], Math.min(...this.outputMagnitudesCloneSpare), Math.max(...this.outputMagnitudesCloneSpare))
                }
                for (let t = 0; t < this.outputs; t++) {
                    this.outputMagnitudes[t] = this.normalize(this.outputMagnitudes[t], Math.min(...this.outputMagnitudesCloneSpare), Math.max(...this.outputMagnitudesCloneSpare))
                    // this.outputMagnitudes[t] = this.truenormalize(this.outputMagnitudes[t], Math.min(...this.outputMagnitudesClone), Math.max(...this.outputMagnitudesClone))
                    this.outputSum += this.outputMagnitudes[t]
                }
                // if (this.outputSum != 0) {
                //     this.outputSum = 1 / this.outputSum
                // } else {
                //     this.outputSum = 0
                // }
                // for (let t = 0; t < this.outputs; t++) {
                //     this.outputMagnitudes[t] *= this.outputSum
                // }
                // this.outputcheck = 0
                // for (let t = 0; t < this.outputs; t++) {
                //     this.outputcheck += this.outputMagnitudes[t]
                // }
                // if (this.outputcheck == 0) {
                //     this.outputMagnitudes[this.outputMagnitudesCloneSpare.indexOf(Math.max(...this.outputMagnitudesCloneSpare))] = 1
                // }

                this.structure = this.structureclone


                if(this.outputMagnitudes[0] == Math.max(...this.outputMagnitudes)){
                    this.seekfood()
                }else  if(this.outputMagnitudes[1] == Math.max(...this.outputMagnitudes)){
                    this.avoid()
                }else  if(this.outputMagnitudes[2] == Math.max(...this.outputMagnitudes)){
                    // this.follow()   
                    this.seekfood()
                }

                // this.dot.move()
                this.dot.draw()
            }
            follow(){
                let maxlength = 10000
                let point = new Circle(0,0,0,"red")
                for(let t = 0;t<meshes.length;t++){
                    if(meshes[t]!= this){
                        let link = new LineOP(this.dot, meshes[t].dot)
                        if(link.hypotenuse() < maxlength){
                            maxlength = link.hypotenuse()
                            point.x = meshes[t].dot.x
                            point.y = meshes[t].dot.y
    
                        }
                    }
                }

                let xdir = (point.x-this.dot.x)/100
                let ydir = (point.y-this.dot.y)/100

                for(let t = 0;(Math.abs(xdir)+Math.abs(ydir)) > 2; t++){
                    xdir *= .99
                    ydir *= .99
                    if(t > 1000){
                        break
                    }
                }
                for(let t = 0;(Math.abs(xdir)+Math.abs(ydir)) < 2; t++){
                    xdir *= 1.01
                    ydir *= 1.01
                    if(t > 1000){
                        break
                    }
                }

                this.dot.x += xdir
                this.dot.y += ydir

            }
            avoid(){


                let xdir = (deathzone.x-this.dot.x)/100
                let ydir =(deathzone.y-this.dot.y)/100



                for(let t = 0;(Math.abs(xdir)+Math.abs(ydir)) > 2; t++){
                    xdir *= .99
                    ydir *= .99
                    if(t > 1000){
                        break
                    }
                }
                for(let t = 0;(Math.abs(xdir)+Math.abs(ydir)) < 2; t++){
                    xdir *= 1.01
                    ydir *= 1.01
                    if(t > 1000){
                        break
                    }
                }

                this.dot.x -= xdir
                this.dot.y -= ydir
            }
            seekfood(){
                let maxlength = 10000
                let point = new Circle(0,0,0,"red")
                for(let t = 0;t<foods.length;t++){
                    let link = new LineOP(this.dot, foods[t])
                    if(link.hypotenuse() < maxlength){
                        maxlength = link.hypotenuse()
                        point.x = foods[t].x
                        point.y = foods[t].y

                    }
                }

                let xdir = (point.x-this.dot.x)/100
                let ydir = (point.y-this.dot.y)/100

                for(let t = 0;(Math.abs(xdir)+Math.abs(ydir)) > 2; t++){
                    xdir *= .99
                    ydir *= .99
                    if(t > 1000){
                        break
                    }
                }
                for(let t = 0;(Math.abs(xdir)+Math.abs(ydir)) < 2; t++){
                    xdir *= 1.01
                    ydir *= 1.01
                    if(t > 1000){
                        break
                    }
                }

                this.dot.x += xdir
                this.dot.y += ydir
            }
            lognormalize(output) {
                return (1 / (1 + Math.pow(Math.E, (output * -1))))
            }
            normalize(val, min, max) {
                // if (min < 0) {
                //     max += 0 - min;
                //     val += 0 - min;
                //     min = 0;
                // }
                // val = val - min;
                // max = max - min;
                // return Math.max(0, Math.min(1, val / max));
                return Math.max(val, 0)
            }
            truenormalize(val, min, max) {
                if (min < 0) {
                    max += 0 - min;
                    val += 0 - min;
                    min = 0;
                }
                val = val - min;
                max = max - min;
                if (max == 0) {
                    max = .0000001
                }
                return val / max
                // return Math.max(Math.min(val,1),0)
            }
        }
        let meshes = []
        let inputArray = []

        let outputexpected = [.01, .99]
        // for (let t = 0; t < 784; t++) {
        //     inputArray.push(Math.random())
        // }



        // let clone = new GenNN(origin.inputs, origin.layercount, origin.layersetupArray, 4)
        // for (let t = 0; t < origin.structure.length; t++) {
        //     for (let k = 0; k < origin.structure[t].length; k++) {
        //         for (let p = 0; p < origin.structure[t][k].weights.length; p++) {
        //             clone.structure[t][k].weights[p] = origin.structure[t][k].weights[p]
        //             clone.structure[t][k].bias = origin.structure[t][k].bias
        //         }
        //     }
        // }
        // clone.generation = origin.generation + 1
        // clone.r = 220
        // clone.g = 220
        // clone.b = 40
        // clone.parent = origin.name
        // clone.name = `rgb(${clone.r},${clone.g},${clone.b})`

        // clone.changeInputs([.05, .10])
        // meshes.push(clone)

        console.log(meshes)
        let mutationratebig = .019
        let mutationrate = .009
        let mutationratesmall = .0009
        let mutationratemicro = .00019
        let boing = 0

        let deathzone = new Circle(100, 100, 80, "#FF00AA44", 3*Math.random()-.5, 3*Math.random()-.5, 1, 1)

        inputArray = [0,0]// [deathzone.x, deathzone.y, 0, 0] //deathzone.xmom, deathzone.ymom,
        let foods = []

        for (let t = 0; t < 500; t++) {
            let food = new Circle(Math.random() * 700, Math.random() * 700, .5, "cyan")
            // inputArray.push(food.x)
            // inputArray.push(food.y)
            foods.push(food)
        }

        let gobot = new GenNN(inputArray, 3, [9, 6, 3], 0)

        meshes.push(gobot)
        let gobot2 = new GenNN(inputArray, 3, [9, 6, 3], 0)

        meshes.push(gobot2)
        function main() {
            canvas_context.clearRect(0, 0, 700, 700)
            if (keysPressed['y']) {
                if (logger == 1) {
                    console.log(meshes)
                    logger = 0
                    boing += 1
                    boing %= meshes[0].structure[0][0].weights.length
                }
            }
            deathzone.move()
            deathzone.draw()
            // inputArray = [deathzone.x, deathzone.y, deathzone.xmom, deathzone.ymom]
            for (let t = 0; t < foods.length; t++) {
                foods[t].draw()
                for (let k = 0; k < meshes.length; k++) {
                    if (meshes[k].dot.doesPerimeterTouch(foods[t])) {
                        foods[t].x = Math.random() * 700
                        foods[t].y = Math.random() * 700
                        meshes[k].fed+=5
                        if(meshes[k].fed > 5){
                            let newmesh = meshes[k].clone(meshes[k].dot.x, meshes[k].dot.y)
                            newmesh.mutate()
                            meshes.push(newmesh)    
                            meshes[k].fed = 0
                        }
                    }
                }
                // inputArray.push(foods[t].x)
                // inputArray.push(foods[t].y)

            }

            for (let k = 0; k < meshes.length; k++) {


                let maxlength = 10000
                let point = new Circle(0,0,0,"red")
                for(let t = 0;t<foods.length;t++){
                    let link = new LineOP(meshes[k].dot, foods[t])
                    if(link.hypotenuse() < maxlength){
                        maxlength = link.hypotenuse()
                        point.x = foods[t].x
                        point.y = foods[t].y

                    }
                }

                let link1 = new LineOP(meshes[k].dot, point)
                let link2 = new LineOP(meshes[k].dot, deathzone)

                // inputArray = [Math.abs(deathzone.x-meshes[k].dot.x), Math.abs(deathzone.y-meshes[k].dot.y), Math.abs(point.x-meshes[k].dot.x), Math.abs(point.y-meshes[k].dot.y)] //meshes[k].dot.x,meshes[k].dot.y,  //deathzone.xmom, deathzone.ymom, 
                inputArray = [link1.hypotenuse(), link2.hypotenuse()]  // [Math.abs(deathzone.x-meshes[k].dot.x), Math.abs(deathzone.y-meshes[k].dot.y), Math.abs(point.x-meshes[k].dot.x), Math.abs(point.y-meshes[k].dot.y)] //meshes[k].dot.x,meshes[k].dot.y,  //deathzone.xmom, deathzone.ymom, 
                meshes[k].changeInputs(inputArray)
            }


            for (let k = 0; k < meshes.length; k++) {
                if (meshes[k].dot.x < 0) {

                    meshes.splice(k, 1)
                } else if (meshes[k].dot.y < 0) {

                    meshes.splice(k, 1)
                } else if (meshes[k].dot.y > 700) {

                    meshes.splice(k, 1)
                } else if (meshes[k].dot.x > 700) {
                    meshes.splice(k, 1)
                } else if (meshes[k].dot.doesPerimeterTouch(deathzone)) {
                    meshes.splice(k, 1)
                }
            }


            // for (let p = 0; p < meshes.length; p++) {
            //     backprop(meshes[p], outputexpected)
            //     meshes[p].changeInputs([.05, .1])
            // }
            if(meshes.length == 0){

        let gobot = new GenNN(inputArray, 3, [9, 6, 3], 0)

        meshes.push(gobot)
        let gobot2 = new GenNN(inputArray, 3, [9, 6, 3], 0)

        meshes.push(gobot2)
            }
        }

    }, 1);

    function logistic_deriv(target) {
        return Math.pow(Math.E, target) / (((1 + Math.pow(Math.E, target)) * (1 + Math.pow(Math.E, target))))
    }


    function backprop(network, goal) {
        let totalerror = 0
        let errororder = []
        for (let t = 0; t < network.layersetupArray[network.layersetupArray.length - 1]; t++) {
            let localerror = ((network.outputMagnitudes[t] - goal[t]) * (network.outputMagnitudes[t] - goal[t]))
            totalerror += (localerror * .5)
            errororder.push([(network.outputMagnitudes[t] - goal[t]), network.outputMagnitudes[t]])
        }

        let fixes = []
        let intermediatevaues = []
        for (let t = network.structure.length - 1; t >= 0; t--) {
            let rowvalues = []
            for (let k = network.structure[t].length - 1; k >= 0; k--) {
                let weightedsum = 0
                if (t != 0) {
                    for (let j = network.structure[t - 1].length - 1; j >= 0; j--) {
                        let deriv = ((errororder[k][0]) * (errororder[k][1] * (1 - errororder[k][1])))
                        let value = network.structure[t - 1][j].value
                        network.structure[t - 1][j].errorderiv = deriv * value
                        fixes.push([t, k, j, (network.structure[t - 1][j].errorderiv * .1)])
                    }
                } else {
                    for (let j = network.inputs.length - 1; j >= 0; j--) {
                        let deriv = ((errororder[k][0]) * (errororder[k][1] * (1 - errororder[k][1])))
                        let value = network.inputs[j]
                        network.structure[t][k].errorderiv = deriv * value
                        // network.structure[t][j].weights[k]-=network.structure[t-1][j].errorderiv*.01
                        fixes.push([t, k, j, (network.structure[t][k].errorderiv * .1)])
                    }
                }
                // weightedsum +=network.structure[t][k].bias
                rowvalues.push(weightedsum)
            }
            intermediatevaues.push(rowvalues)
        }


        for (let t = 0; t < fixes.length; t++) {
            if (!Number.isNaN(fixes[t][3])) {
                network.structure[fixes[t][0]][fixes[t][1]].weights[fixes[t][2]] -= fixes[t][3]
            }
        }

        console.log(totalerror, intermediatevaues)
    }

})
