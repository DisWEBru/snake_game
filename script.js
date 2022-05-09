(function () {
    let dw = {}

    dw.snake = []

    dw.cube_count = 12
    dw.move_time_start = 500

    /**
     * Случайное число от и до не включая последнее число
     * @param int начальное число
     * @param int конечное, которое не включается
     * @returns int
     */
    dw.getInterval = function (min, max) {
        min = Math.ceil(min)
        max = Math.floor(max)

        return Math.floor(Math.random() * (max - min)) + min
    }

    dw.init = function () {
        document.body.addEventListener('keydown', function (e) {
            e = e || window.event;
            let direction

            if (e.keyCode == '38')
                direction = 'up'
            else if (e.keyCode == '40')
                direction = 'down'
            else if (e.keyCode == '37')
                direction = 'left'
            else if (e.keyCode == '39')
                direction = 'right'
            else
                return

            if (dw.direction_last == 'up') {
                if (direction != 'down')
                    dw.direction = direction
            } else if (dw.direction_last == 'down') {
                if (direction != 'up')
                    dw.direction = direction
            } else if (dw.direction_last == 'left') {
                if (direction != 'right')
                    dw.direction = direction
            } else if (dw.direction_last == 'right') {
                if (direction != 'left')
                    dw.direction = direction
            }
        })

        dw.place = document.body.querySelector('.game__place')

        dw.start_el = document.body.querySelector('.game__start-btn')

        dw.score_el = document.body.querySelector('.game__score')

        dw.start_el.addEventListener('click', function () {
            dw.start_el.style.display = 'none'

            dw.start()
        })

        dw.btn_up = document.body.querySelector('.game__control-up i')

        dw.btn_up.addEventListener('click', function () {
            if (dw.direction_last != 'down')
                dw.direction = 'up'
        })

        dw.btn_down = document.body.querySelector('.game__control-down i')

        dw.btn_down.addEventListener('click', function () {
            if (dw.direction_last != 'up')
                dw.direction = 'down'
        })

        dw.btn_left = document.body.querySelector('.game__control-left i')

        dw.btn_left.addEventListener('click', function () {
            if (dw.direction_last != 'right')
                dw.direction = 'left'
        })

        dw.btn_right = document.body.querySelector('.game__control-right i')

        dw.btn_right.addEventListener('click', function () {
            if (dw.direction_last != 'left')
                dw.direction = 'right'
        })
    }

    dw.start = function () {
        if (dw.snake.length > 0) {
            for (let i = 0; i < dw.snake.length; i++) {
                dw.snake[i].el.remove()
            }

            dw.snake = []
        }

        dw.cube_count_width = dw.cube_count
        dw.cube_count_height = dw.cube_count * 1.5

        dw.move_time = dw.move_time_start
        dw.direction = 'up'
        dw.direction_last = 'up'
        dw.cube_width = 100 / dw.cube_count
        dw.cube_height = dw.cube_width / 1.5
        dw.cube_start_cords = dw.cube_count_width / 2

        dw.score = 0

        dw.score_el.innerHTML = dw.score

        dw.add()
        dw.add()
        dw.add()

        dw.point()

        dw.headBlinking()

        dw.move_timeout = setTimeout(function () {
            dw.move()
        }, dw.move_time)
    }

    dw.gameOver = function () {
        if (dw.snake.length > 0) {
            for (let i = 0; i < dw.snake.length; i++) {
                dw.snake[i].el.remove()
            }

            dw.snake = []
        }

        if (dw.point_cube != undefined) {
            dw.point_cube.el.remove()
            dw.point_cube = undefined
        }

        dw.start_el.style.display = null
    }

    dw.add = function () {
        let cube = {
            coords: {}
        }

        if (dw.snake.length > 0)
            cube.coords.now = {
                top: dw.snake[dw.snake.length - 1].coords.back.top,
                left: dw.snake[dw.snake.length - 1].coords.back.left
            }
        else
            cube.coords.now = {
                top: dw.cube_start_cords,
                left: dw.cube_start_cords
            }

        cube.coords.back = {
            top: cube.coords.now.top + 1,
            left: cube.coords.now.left
        }

        if (cube.coords.back.top >= dw.cube_count_height)
            cube.coords.back.top = 0

        cube.el = document.createElement('div')
        cube.el.className = 'game__cube'

        dw.place.append(cube.el)

        cube.el.style.top = (cube.coords.now.top * dw.cube_height) + '%'
        cube.el.style.left = (cube.coords.now.left * dw.cube_width) + '%'
        cube.el.style.width = dw.cube_width + '%'
        cube.el.style.height = dw.cube_height + '%'
        cube.el.style.opacity = '1'

        dw.snake.push(cube)
    }

    dw.headBlinking = function () {
        if (dw.snake.length <= 0)
            return

        if (dw.snake[0].el.style.opacity == '1')
            dw.snake[0].el.style.opacity = '0.7'
        else
            dw.snake[0].el.style.opacity = '1'

        if (dw.point_cube != undefined) {
            if (dw.point_cube.el.style.opacity == '1')
                dw.point_cube.el.style.opacity = '0.7'
            else
                dw.point_cube.el.style.opacity = '1'
        }

        setTimeout(function () {
            dw.headBlinking()
        }, 500)
    }

    dw.move = function () {
        if (dw.snake.length <= 0)
            return

        dw.snake[0].coords.back = {
            top: dw.snake[0].coords.now.top,
            left: dw.snake[0].coords.now.left
        }

        if (dw.direction == 'up') {
            dw.snake[0].coords.now.top = dw.snake[0].coords.now.top - 1

            if (dw.snake[0].coords.now.top < 0)
                dw.snake[0].coords.now.top = dw.cube_count_height - 1
        } else if (dw.direction == 'down') {
            dw.snake[0].coords.now.top = dw.snake[0].coords.now.top + 1

            if (dw.snake[0].coords.now.top >= dw.cube_count_height)
                dw.snake[0].coords.now.top = 0
        } else if (dw.direction == 'left') {
            dw.snake[0].coords.now.left = dw.snake[0].coords.now.left - 1

            if (dw.snake[0].coords.now.left < 0)
                dw.snake[0].coords.now.left = dw.cube_count_width - 1
        } else if (dw.direction == 'right') {
            dw.snake[0].coords.now.left = dw.snake[0].coords.now.left + 1

            if (dw.snake[0].coords.now.left >= dw.cube_count_width)
                dw.snake[0].coords.now.left = 0
        }

        for (let i = 0; i < dw.snake.length; i++) {
            if (i > 0) {
                dw.snake[i].coords.back = {
                    top: dw.snake[i].coords.now.top,
                    left: dw.snake[i].coords.now.left
                }

                dw.snake[i].coords.now = {
                    top: dw.snake[i - 1].coords.back.top,
                    left: dw.snake[i - 1].coords.back.left
                }
            }

            dw.snake[i].el.style.top = (dw.snake[i].coords.now.top * dw.cube_height) + '%'
            dw.snake[i].el.style.left = (dw.snake[i].coords.now.left * dw.cube_width) + '%'
        }

        for (let i = 1; i < dw.snake.length; i++) {
            if (dw.snake[i].coords.now.top == dw.snake[0].coords.now.top
                && dw.snake[i].coords.now.left == dw.snake[0].coords.now.left) {
                dw.gameOver()

                return
            }
        }

        if (dw.point_cube != undefined) {
            if (dw.snake[0].coords.now.top == dw.point_cube.top
                && dw.snake[0].coords.now.left == dw.point_cube.left) {
                dw.add()
                dw.point()
                dw.move_time = dw.move_time * 0.95
                dw.score++

                dw.score_el.innerHTML = dw.score
            }
        }

        dw.direction_last = dw.direction

        setTimeout(function () {
            dw.move()
        }, dw.move_time)
    }

    dw.point = function () {
        if (dw.snake.length <= 0)
            return

        if (dw.point_cube != undefined)
            dw.point_cube.el.remove()

        dw.point_cube = {}

        dw.point_cube.el = document.createElement('div')
        dw.point_cube.el.className = 'game__point'

        dw.place.append(dw.point_cube.el)

        while (true) {
            dw.point_cube.top = dw.getInterval(0, dw.cube_count_height)
            dw.point_cube.left = dw.getInterval(0, dw.cube_count_width)

            let is_true = true

            for (let i = 0; i < dw.snake.length; i++) {
                if (dw.snake[i].coords.now.top == dw.point_cube.top
                    && dw.snake[i].coords.now.left == dw.point_cube.left) {
                    is_true = false
                    break
                }
            }

            if (!is_true)
                continue

            break
        }

        dw.point_cube.el.style.top = (dw.point_cube.top * dw.cube_height) + '%'
        dw.point_cube.el.style.left = (dw.point_cube.left * dw.cube_width) + '%'
        dw.point_cube.el.style.width = dw.cube_width + '%'
        dw.point_cube.el.style.height = dw.cube_height + '%'
        dw.point_cube.el.style.opacity = '1'
    }

    dw.init()
})()