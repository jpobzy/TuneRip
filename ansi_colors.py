class colors:
    """ ANSI color codes """
    black = "\033[0;30m"
    red = "\033[0;31m"
    green = "\033[0;32m"
    brown = "\033[0;33m"
    blue = "\033[0;34m"
    purple = "\033[0;35m"
    cyan = "\033[0;36m"
    light_gray = "\033[0;37m"
    dark_gray = "\033[1;30m"
    light_red = "\033[1;31m"
    light_green = "\033[1;32m"
    yellow = "\033[1;33m"
    light_blue = "\033[1;34m"
    light_purple = "\033[1;35m"
    light_cyan = "\033[1;36m"
    light_white = "\033[1;37m"
    bold = "\033[1m"
    faint = "\033[2m"
    italic = "\033[3m"
    underline = "\033[4m"
    blink = "\033[5m"
    negative = "\033[7m"
    crossed = "\033[9m"
    end = "\033[0m"

    # cancel SGR codes if we don't write to a terminal
    if not __import__("sys").stdout.isatty():
        for _ in dir():
            if isinstance(_, str) and _[0] != "_":
                locals()[_] = ""
    else:
        # set Windows console in VT mode
        if __import__("platform").system() == "Windows":
            kernel32 = __import__("ctypes").windll.kernel32
            kernel32.SetConsoleMode(kernel32.GetStdHandle(-11), 7)
            del kernel32

    
def print_colored_text(input_color, input_string):
    if hasattr(colors, input_color):
        print(getattr(colors, input_color) + input_string + colors.end)
    else:
        print("Invalid color:", colors.red + input_color + colors.end)
        print('Color options are: ' +  ', '.join(color for color in dir(colors) if color[0:1] != '_' and color != 'END') + colors.end)



