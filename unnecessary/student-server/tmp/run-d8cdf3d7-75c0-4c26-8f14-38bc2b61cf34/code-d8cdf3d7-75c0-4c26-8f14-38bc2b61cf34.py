def get_user_name():
    """Prompt the user to enter their name until a non-empty input is provided."""
    while True:
        name = input("Enter your name (or 'quit' to exit): ")
        if name.lower() == 'quit':
            print("Exiting program. Goodbye!")
            return None
        elif name.strip():  # Check if the input is not empty
            return name

def main():
    # Get the user's name
    name = get_user_name()

    # Check if the user exited the program
    if name is None:
        return

    # Print a personalized greeting
    print(f"Hello {name}!")

if __name__ == "__main__":
    main()