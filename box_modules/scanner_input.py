import time
import curses
import atexit


GPIOS=32
MODES=["INPUT", "OUTPUT", "ALT5", "ALT4", "ALT0", "ALT1", "ALT2", "ALT3"]

def cleanup(): #cleanup functio  undoes all of the curses init stuff
   curses.nocbreak()
   curses.echo()
   curses.endwin()
    #optional gpio cleanup here

stdscr = curses.initscr()
curses.noecho()
curses.cbreak() #this makes us wait on an enter key, which I believe is what we want

atexit.register(cleanup)#this registers our cleanup function to run when the program exits, might want it to do that every time we read a scan?

#do program here, atleast the barcode input bit
stdscr.nodelay(True) #check on what this does

stdscr.addstr(0, 23, "Status of gpios 0-31", curses.A_REVERSE)

while True:
  
  for g in range(GPIOS):
    a = 1
    #random printouts of gpio stuff using imaginary 'pi' gpio library
    #std screen is how we add strings to our screen, we are probably fine just taking the automatic input given by curses.echo(), just need to figure out how to z 
    #stdscr.addstr(row, col, "{:2}".format(g), curses.A_BOLD)
    #stdscr.addstr("={} {:>6}: {:<10}".format(pi.read(g), MODES[mode], tally))
   
  stdscr.refresh()
  
  time.sleep(0.1)
  
  c = stdscr.getch()#reread user input section of curses docs, but essentially getch() returns the ascii key value of key pressed, possibly want to loop on this to construct barcode string? 
  
  if c != curses.ERR:
    break
