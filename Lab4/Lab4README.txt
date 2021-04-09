/**
 * Lab 4
 * @author Adam Clifton
 * @email (akclifto@asu.edu)
 *
 */

 Activity 1: Implemented

 Activity 2: Please view the console while running the SPA to see additional info about the events.
    
    R1: Implemented, but I cannot get any cookies to work in my browser, the functionality is
    present, but I am not able to test it to see if it works.
        functionality:  
            setCookie
            getCookie
            Window.onload check for "remembered user"
            "Welcome back greeting"
    
    R2: Implemented
    R3: Implemented
    R4: Implemented
    R5: Implemented

Activity 3:
    R1: Implemented with localStorage to persist state for username and commnets if browser closed.
    R2: Implemented
    R3: Implemented
        Testing cases used:
            1. stupid stupid stupid stupid stupid stupid stupid stupid
            2. inept inept inept inept inept inept inept
            3. ugly ugly ugly ugly ugly ugly ugly ugly ugly ugly
            4. dark dark dark dark dark dark dark  
            5. stupid inept dark stupid inept inept dark dark
            6. this comment is dumb and stupid you are inept heartless and weak.  Don't be a dark dumb idiot baby.
    R4: Implemented
    R5: Implemented
    R6: Implemented
    R7:

Test input for string commands:
    /clear : clears state of app (session and localStorage)

    /search <key>: returns answers array for given session in user-comments textarea
        Ex: /search stupid
            /SEARCH inept
            /search blah

    /history : list of all searches done within session below user-comments textarea
    
    /count : returns number of censored words within session in the user-comments textarea
    
    /list : lists all the review user has submitted within session below user-comments textarea