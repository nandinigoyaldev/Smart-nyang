#!/usr/bin/env python3
"""
SmartDog (Namyang Puppy) — Native macOS & Windows Transparent Desktop Dog Mascot
Free, Open Source, Lightweight, Always-On-Top Pixel Dog Companion
"""

import tkinter as tk
import math
import random
import signal
import sys

class DesktopMascot:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("SmartDog Desktop Pet")
        
        # Make Window Frameless, Transparent & Always-On-Top
        self.root.overrideredirect(True)
        self.root.attributes("-topmost", True)
        
        # Transparent Background for macOS & Windows
        try:
            self.root.wm_attributes("-transparent", True)
            self.root.config(bg="systemTransparent")
            self.bg_color = "systemTransparent"
        except Exception:
            self.bg_color = "#010101"
            self.root.config(bg=self.bg_color)
            self.root.wm_attributes("-transparentcolor", self.bg_color)

        # Mascot Window Geometry
        screen_w = self.root.winfo_screenwidth()
        screen_h = self.root.winfo_screenheight()
        self.win_w = 200
        self.win_h = 240
        self.cur_x = max(10, screen_w - self.win_w - 60)
        self.cur_y = max(10, screen_h - self.win_h - 80)
        self.root.geometry(f"{self.win_w}x{self.win_h}+{self.cur_x}+{self.cur_y}")

        # Dog Design Properties
        self.fur_color = "#f39c12"      # Golden / Orange
        self.belly_color = "#ffffff"
        self.ear_color = "#d35400"
        self.dog_name = "Namyang Puppy"
        
        # Animation & Movement States
        self.action = "idle"  # 'idle', 'walking', 'sleeping', 'sitting'
        self.direction = "right"
        self.walk_step = 0
        self.speech_text = "Woof! I'm sitting on your desktop! 🐾"
        self.speech_timer = 25

        # Canvas for drawing Pixel Dog mascot
        self.canvas = tk.Canvas(
            self.root, 
            width=self.win_w, 
            height=self.win_h, 
            bg=self.bg_color, 
            highlightthickness=0
        )
        self.canvas.pack(fill="both", expand=True)

        # Dragging variables
        self.drag_start_x = 0
        self.drag_start_y = 0

        # Event Bindings
        self.canvas.bind("<Button-1>", self.on_click)
        self.canvas.bind("<B1-Motion>", self.on_drag)

        # Graceful signal handling for exit
        signal.signal(signal.SIGINT, lambda s, f: self.safe_quit())
        signal.signal(signal.SIGTERM, lambda s, f: self.safe_quit())
        self.root.protocol("WM_DELETE_WINDOW", self.safe_quit)

        # Create persistent canvas elements ONCE
        self.items = {}
        self.init_canvas_items()
        self.update_mascot()

        # Loops
        self.running = True
        self.update_loop()
        self.behavior_loop()

    def init_canvas_items(self):
        """Create all canvas items ONCE to avoid Tcl memory leaks."""
        # Speech Bubble
        bx, by, bw, bh = 10, 10, 180, 45
        self.items['speech_rect'] = self.canvas.create_rectangle(bx, by, bx+bw, by+bh, fill="#ffffff", outline="#000000", width=2)
        self.items['speech_tail'] = self.canvas.create_polygon(bx+70, by+bh, bx+85, by+bh+10, bx+95, by+bh, fill="#ffffff", outline="#000000", width=1)
        self.items['speech_text'] = self.canvas.create_text(bx+bw/2, by+bh/2, text="", font=("Helvetica", 10, "bold"), fill="#0f172a", width=160)

        cx, cy = 100, 130

        # Shadow
        self.items['shadow'] = self.canvas.create_oval(cx-40, cy+50, cx+40, cy+62, fill="#000000", outline="", stipple="gray50")

        # Tail
        self.items['tail'] = self.canvas.create_polygon(cx+25, cy+10, cx+40, cy-5, cx+42, cy-10, cx+35, cy+10, fill=self.fur_color, outline="#000000", width=2)

        # Legs
        self.items['leg_l'] = self.canvas.create_rectangle(cx-20, cy+25, cx-10, cy+45, fill=self.fur_color, outline="#000000", width=2)
        self.items['leg_r'] = self.canvas.create_rectangle(cx+10, cy+25, cx+20, cy+45, fill=self.fur_color, outline="#000000", width=2)

        # Body
        self.items['body'] = self.canvas.create_rectangle(cx-30, cy, cx+30, cy+30, fill=self.fur_color, outline="#000000", width=2)
        self.items['belly'] = self.canvas.create_rectangle(cx-15, cy+10, cx+15, cy+30, fill=self.belly_color, outline="")

        # Head & Ears
        self.items['ear_l'] = self.canvas.create_polygon(cx-32, cy-25, cx-15, cy-25, cx-28, cy, fill=self.ear_color, outline="#000000", width=2)
        self.items['ear_r'] = self.canvas.create_polygon(cx+15, cy-25, cx+32, cy-25, cx+28, cy, fill=self.ear_color, outline="#000000", width=2)

        self.items['head'] = self.canvas.create_rectangle(cx-30, cy-30, cx+30, cy, fill=self.fur_color, outline="#000000", width=2)
        self.items['snout'] = self.canvas.create_rectangle(cx-12, cy-15, cx+12, cy, fill=self.belly_color, outline="#000000", width=1)
        self.items['nose'] = self.canvas.create_rectangle(cx-4, cy-18, cx+4, cy-12, fill="#000000", outline="")

        # Eyes
        self.items['eye_l'] = self.canvas.create_rectangle(cx-18, cy-22, cx-10, cy-14, fill="#2c3e50", outline="#000000")
        self.items['eye_r'] = self.canvas.create_rectangle(cx+10, cy-22, cx+18, cy-14, fill="#2c3e50", outline="#000000")

    def update_mascot(self):
        """Update canvas elements."""
        speech_state = "normal" if self.speech_text else "hidden"
        for key in ['speech_rect', 'speech_tail', 'speech_text']:
            self.canvas.itemconfig(self.items[key], state=speech_state)
        if self.speech_text:
            self.canvas.itemconfig(self.items['speech_text'], text=self.speech_text)

    def on_click(self, event):
        self.drag_start_x = event.x
        self.drag_start_y = event.y
        
        greetings = [
          "Woof! Living on your desktop! 🐾",
          "Need a break from coding? 🐶",
          "Hydration check! Grab some water 💧",
          "You're doing awesome today! 💖"
        ]
        self.speech_text = random.choice(greetings)
        self.speech_timer = 20
        self.update_mascot()

    def on_drag(self, event):
        self.cur_x = self.root.winfo_x() + (event.x - self.drag_start_x)
        self.cur_y = self.root.winfo_y() + (event.y - self.drag_start_y)
        self.root.geometry(f"+{self.cur_x}+{self.cur_y}")

    def behavior_loop(self):
        if not self.running:
            return
        
        # Periodically walk around screen
        if random.random() > 0.6:
            self.action = "walking"
            self.direction = random.choice(["left", "right"])
        else:
            self.action = "idle"

        self.root.after(5000, self.behavior_loop)

    def update_loop(self):
        if not self.running:
            return

        if self.action == "walking":
            delta = 3 if self.direction == "right" else -3
            screen_w = self.root.winfo_screenwidth()
            self.cur_x = max(10, min(screen_w - self.win_w - 10, self.cur_x + delta))
            self.root.geometry(f"+{self.cur_x}+{self.cur_y}")

        if self.speech_timer > 0:
            self.speech_timer -= 1
            if self.speech_timer <= 0:
                self.speech_text = ""
                self.update_mascot()

        self.root.after(150, self.update_loop)

    def safe_quit(self):
        self.running = False
        try:
            self.root.destroy()
        except Exception:
            pass
        sys.exit(0)

    def run(self):
        try:
            self.root.mainloop()
        except KeyboardInterrupt:
            self.safe_quit()

if __name__ == "__main__":
    app = DesktopMascot()
    app.run()
