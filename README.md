# BATTLESHIPS
:ship: :anchor: :boom: :boom: :speedboat: :boat:

This is standard battleship game, implemented in JavaScript, in web browser environment. It is standalone, serverless version with AI.

## Road map:
* [x] Figure out AI for:
  - [x] placing ships on the board
  - [x] shooting tactics
* [x] Setup the project
  - [x] Generate boilerplate code
* [x] Create BE and API
  - [ ] Models and tests for
    * [ ] Game
    * [ ] Player
    * [ ] Board
    * [ ] Ship
  - [ ] Storage and data structure for boards
  - [ ] Status of the game
  - [ ] Room for games
  - [ ] Hardcode values for room, number of players, ships and board size, but leave it opened for extension
  - [ ] API for setting up boards (with collision verification)
  - [ ] API for shooting and sinking ships
  - [ ] API for player's turns
  - [ ] API for defining (external) AIs (board setup, shooting tactics)
  - [ ] Error handling done via returned values or callbacks, without thrown exceptions
* [ ] Create FE
  - [ ] Main menu
  - [ ] Board
  - [ ] Interface for setting up the board
  - [ ] Interface for shooting
  - [ ] Interface for showing current status of opponent/player boards
  - [ ] End of the game status & boards
  - [ ] Stats for AIs
* [ ] Random board set up for AI and players
  - [ ] Function to check if a board with line-up is valid
  - [ ] Start from up-left corner and move one cell by one, full right and then down. Check for each ship type if it could be placed there vertically or horizontally List all available starting points for each ship type and each position (vertical/horizontal) Randomly pick a position and starting cell if it is possible Once a ship is placed remove starting points from availability list. If there is no place to put remaining ships, start the process over again
  - [ ] Use probability estimations for better ship placement
* [ ] Create easy AI (random shoots)
* [ ] Create medium AI (random shoots, when it hits and do not sink the ship, continue shooting left/right or up/down)
* [ ] Create hard AI (Sophisticated solution with track of previous games)
  - [ ] After hitting, but not sinking a ship use the same approach as medium AI
  - [ ] Per each cell keep how many times the cell was used for various ships
  - [ ] For even better results (2nd version) use formula:
    Sum of all:
    ```
    ([size of the ship] / [sum of all sizes]) * [number of placement of ship of size]
    ```
    For instance for 1-, 2-, 3-, 4- sized ships:
  	```
    1/10 * numSize1 + 2/10 * numSize2 + 3/10 * numSize3 + 4/10 * numSize4
    ```
    Explanation: We want to reveal as biggest chunk of the board as possible, therefor we hunt the biggest available ship first, so let's give it the biggest share
  - [ ] Use the number from above in SoftMax function to calculate probability of ship being in cells, use only unrevealed cells (0-hidden, x-hit, o-miss):
  ```
	[[x,x,o],
	 [o,o,o],  -> will use only the last row to estimate probability
	 [0,0,0]]
  ```
  - [ ] 3rd version of AI (need more data tough): Remember status of each board after and before sinking ships, so the AI could guess the line-up better. In the next game with similar line-up, find corresponding board and make a shot based on probability for that board. Values for SoftMax function would come from more specific pool.
