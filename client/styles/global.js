// import { Dimensions, StyleSheet } from 'react-native';

// const { width, height } = Dimensions.get('window');

// export default StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'flex-start', // Align items towards the start of the container
//         alignItems: 'center',
//         // paddingTop: 0, // Adjusting the padding at the top to shift elements higher
//         backgroundColor: '#FFFFFF',  // Adding a default background color
//     },
//     title: {
//         fontSize: 24,
//         marginBottom: 20,
//         color: '#222126',  // Default text color from color scheme
//         fontWeight: 'bold',  // Ensuring titles are bold for emphasis
//         fontFamily: 'Oswald-Bold',  // Applying the Oswald-Bold font
//         alignSelf: 'flex-start',  // Aligning text to the left
//         marginLeft: 20,  // Adding left margin for alignment
//     },
//     label: {
//         fontSize: 14,
//         color: '#222126',  // Label text color
//         marginBottom: 5,
//         fontFamily: 'Oswald-Regular',  // Applying the Oswald-Regular font
//         alignSelf: 'flex-start',  // Aligning text to the left
//     },
//     input: {
//         width: '100%',
//         padding: 10,
//         marginBottom: 10,
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 5,  // Adjusting border style to be more rectangular
//         backgroundColor: '#F5F5F5',  // Slight background color for input fields
//         fontFamily: 'Oswald-Regular',  // Applying the Oswald-Regular font
//     },
//     button: {
//         backgroundColor: '#DA583B',  // Primary button color
//         padding: 10,
//         borderRadius: 5,  // Adjusting border style to be more rectangular
//         alignItems: 'center',
//         marginTop: 10,
//     },
//     buttonText: {
//         color: '#FFFFFF',  // Text color for buttons
//         fontSize: 18,
//         fontWeight: 'bold',
//         fontFamily: 'Oswald-SemiBold',  // Applying the Oswald-SemiBold font
//         textTransform: 'uppercase',  // Ensuring text is uppercase
//     },
//     errorText: {
//         color: '#851919',  // Error text color
//         fontSize: 14,
//         marginBottom: 10,
//         fontFamily: 'Oswald-Regular',  // Applying the Oswald-Regular font
//     },
//     filterButton: {
//         backgroundColor: '#F0CB67',  // Filter button color
//         padding: 10,
//         borderRadius: 5,
//         alignItems: 'center',
//         marginBottom: 10,
//         marginHorizontal: 10,  // Adding horizontal margin for spacing between filter buttons
//     },
//     filterButtonText: {
//         color: '#222126',  // Text color for filter buttons
//         fontSize: 16,
//         fontFamily: 'Oswald-Medium',  // Applying the Oswald-Medium font
//     },
//     filterContainer: {
//         flexDirection: 'row',  // Displaying filters in a row
//         justifyContent: 'space-between',  // Spacing filters evenly
//         width: '80%',  // Adjusting width to match card width
//         marginBottom: 20,  // Adding margin below filter buttons
//     },
//     placeholderText: {
//         color: '#A9A9A9',  // Placeholder text color
//         fontSize: 16,
//         fontFamily: 'Oswald-Light',  // Applying the Oswald-Light font
//     },
//     logo: {
//         width: width * 0.8,  // Setting width as smaller for top logo
//         height: height * 0.5,  // Setting height smaller for top logo
//         resizeMode: 'contain',  // Ensuring the image fits within its bounds
//         // reduce space between logo and card 
//         marginBottom: -80
        
//     },
//     card: {
//         width: '80%',  // Setting the card width to 80% of the parent
//         padding: 30,  // Adding more padding inside the card
//         borderRadius: 8,  // Rounding the corners of the card
//         backgroundColor: '#fff',  // Setting the card background color to white
//         shadowColor: '#000',  // Adding shadow color
//         shadowOffset: { width: 0, height: 2 },  // Setting shadow offset
//         shadowOpacity: 0.1,  // Setting shadow opacity
//         shadowRadius: 5,  // Setting shadow radius
//         elevation: 5,  // Adding elevation for Android shadow
//     },
//     cardTitle: {
//         fontSize: 20,  // Setting font size for card title
//         marginBottom: 10,  // Adding space below the title
//         fontWeight: 'normal',  // Making the title thinner
//         color: '#222126',  // Setting the title color
//         fontFamily: 'Oswald-Regular',  // Applying the Oswald-Regular font
//         alignSelf: 'flex-start',  // Aligning text to the left
//     },
//     cardSubtitle: {
//         fontSize: 16,  // Setting font size for card subtitle
//         marginBottom: 20,  // Adding space below the subtitle
//         color: '#222126',  // Setting the subtitle color
//         fontWeight: 'bold',  // Making the subtitle bold
//         fontFamily: 'Oswald-Regular',  // Applying the Oswald-Regular font
//         alignSelf: 'flex-start',  // Aligning text to the left
//     },
//     logoutButton: {
//         position: 'absolute',  // Positioning logout button absolutely
//         top: 20,  // Positioning near the top
//         right: 20,  // Positioning near the right
//         backgroundColor: '#DA583B',  // Button color
//         paddingVertical: 5,  // Vertical padding
//         paddingHorizontal: 10,  // Horizontal padding
//         borderRadius: 3,  // Adjusting border style
//     },
//     logoutButtonText: {
//         color: '#FFFFFF',  // Text color for logout button
//         fontSize: 14,
//         fontWeight: 'bold',
//         fontFamily: 'Oswald-SemiBold',  // Applying the Oswald-SemiBold font
//         textTransform: 'uppercase',  // Ensuring text is uppercase
//     },
//     restaurantList: {
//         alignItems: 'center',  // Centering items in the list
//     },
//     restaurantCard: {
//         width: width * 0.4,  // Setting width for restaurant cards
//         padding: 10,  // Padding inside the card
//         marginBottom: 20,  // Space below each card
//         borderRadius: 10,  // Rounding the corners
//         backgroundColor: '#fff',  // Background color
//         shadowColor: '#000',  // Adding shadow color
//         shadowOffset: { width: 0, height: 2 },  // Setting shadow offset
//         shadowOpacity: 0.1,  // Setting shadow opacity
//         shadowRadius: 5,  // Setting shadow radius
//         elevation: 5,  // Adding elevation for Android shadow
//         alignItems: 'center',  // Centering items in the card
//     },
//     restaurantImage: {
//         width: '100%',  // Full width image
//         height: 100,  // Fixed height for image
//         borderRadius: 10,  // Rounding corners
//         marginBottom: 10,  // Adding space below image
//     },
//     restaurantName: {
//         fontSize: 14,  // Font size for restaurant name
//         color: '#222126',  // Text color
//         fontWeight: 'bold',
//         fontFamily: 'Oswald-Bold',  // Applying the Oswald-Bold font
//         marginBottom: 5,  // Adding space below name
//     },
//     restaurantRating: {
//         fontSize: 14,  // Font size for rating
//         color: '#DA583B',  // Star color
//         fontFamily: 'Oswald-Regular',  // Applying the Oswald-Regular font
//     },
// });
