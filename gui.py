import tkinter as tk

class MyGUI():
    def __init__(self, youtubers):
        self.root = tk.Tk()

        self.label = tk.Label(self.root, text="Welcome", font=('Arial', 18))
        self.label.pack(padx=20, pady=20)
        self.root.geometry('1500x700')
        self.check_state = tk.IntVar() #state of checkbox
        self.btns = {}
        self.display_youtubers(youtubers)
        self.root.mainloop()




    def display_youtubers(self, youtubers):
        buttonframe = tk.Frame(self.root)
        buttonframe.columnconfigure(0, weight=1)
        buttonframe.columnconfigure(1, weight=1)
        buttonframe.columnconfigure(2, weight=1)
        for i in range(len(youtubers)):
            youtuber = next(iter(youtubers[i]))
            btn = tk.Button(buttonframe, text=youtuber, font=('Arial', 18), \
                            width=15, height=1, activebackground="blue",  \
                            command=lambda b=youtuber: self.button_clicked(b))
            btn.grid(row=i//3, column=i % 3, sticky=tk.W + tk.E)
            self.btns[youtuber] = btn
            buttonframe.pack(pady=200)
    
    def display_options(self):
        pass


    def button_clicked(self, btn):
        if self.check_state.get() == 0:
            print(f'button clicked by: {btn}')