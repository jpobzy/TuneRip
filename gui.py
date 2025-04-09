import tkinter as tk
from tkinter import messagebox
from controller import controller
from youtubers import youtubers

class MyGUI():
    def __init__(self):
        self.root = tk.Tk()
        self.label = tk.Label(self.root, text="Welcome", font=('Arial', 18))
        self.label.pack(padx=20, pady=20)
        self.root.geometry('1500x700')
        self.check_state = tk.IntVar() #state of checkbox
        self.btns = {}
        self.controller = controller(youtubers)
        self.display_youtuber_buttons(youtubers)
        self.root.mainloop()


    def display_youtuber_buttons(self, youtubers):
        buttonframe = tk.Frame(self.root)
        buttonframe.columnconfigure(0, weight=1)
        buttonframe.columnconfigure(1, weight=1)
        buttonframe.columnconfigure(2, weight=1)
        j, k = 0,0
        for key, value in youtubers.items():
            youtuber = key
            btn = tk.Button(buttonframe, text=youtuber, font=('Arial', 18), \
                            width=15, height=1, activebackground="blue",  \
                            command=lambda b=youtuber: self.button_clicked(b))
            btn.grid(row=j//3, column=j % 3, sticky=tk.W + tk.E)
            j+=1
            self.btns[youtuber] = btn
            buttonframe.pack(pady=200)

        quit_button = tk.Button(buttonframe, text="Quit", command=self.root.quit)
        quit_button.grid(row=j+1, column= 1, sticky=tk.W + tk.E)
        buttonframe.pack()
       

    def display_quit_button(self, row_num):
        quit_button = tk.Button(self.root, text="Quit", command=self.root.quit)
        quit_button.grid(row=row_num+1, column=0, columnspan=3, pady=10)

    
    def display_options(self):
        pass


    def button_clicked(self, btn):
        if self.check_state.get() == 0:
            self.controller.input_chosen(btn)

            # print(f'button clicked by: {btn}')
            # print(self.btns)


    def remove_btn(self, artist):
        button = self.btns[artist]
        button.destroy()
