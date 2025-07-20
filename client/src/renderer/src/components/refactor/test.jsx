            {current !== total - 1 && (
              <div>
                <Button
                  size="small"
                  onClick={() => {
                    setcurrStep(current + 2)
                  }}
                >
                  Skip
                </Button>     

                

              </div>
            )}
            {/* {originNode} */}

            <Button
                size="small"
                onClick={() => {
                  setcurrStep(current - 1)
                }}
              >
                Prev
              </Button>  
            {current === total ? 
            
              <Button
                size="small"
                onClick={() => {
                  setcurrStep(current + 1)
                }}
              >
                Finish
              </Button> 
              :
          <Button
                size="small"
                onClick={() => {
                  setcurrStep(current + 1)
                }}
              >
                Finish
              </Button>     
          }