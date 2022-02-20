import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';


function Footer() {
    return (
        <Box textAlign="center"
             bgcolor="#2196F3"
             color="white"
             padding="25px"
             boxShadow={20}
        >
            Emergency Patient &reg; {new Date().getFullYear()}
        </Box>
    )
}

export default Footer

