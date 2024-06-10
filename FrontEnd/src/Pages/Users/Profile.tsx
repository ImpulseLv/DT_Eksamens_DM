import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, CircularProgress, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import axios from '../Axios/AxiosConfig';
import Navbar from '../MainPage/Navbar';
import { User } from "../../Types/User";

const Profile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [passwordDialogOpen, setPasswordDialogOpen] = useState<boolean>(false);
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('/users/current');
                setUser(response.data);
                response.data.roles = response.data.roles[0].name;
            } catch (error) {
                setError('Failed to fetch user profile.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }

        try {
            await axios.put(`/users/users/${user?.id}/change-password`, { newPassword, confirmPassword });
            setPasswordDialogOpen(false);
            setNewPassword('');
            setConfirmPassword('');
            setPasswordError('');
        } catch (error) {
            setPasswordError('Failed to change password');
        }
    };

    if (loading) {
        return (
            <Container component="main" maxWidth="lg">
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container component="main" maxWidth="lg">
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }

    return (
        <>
            <Navbar />
            <Box display="flex" style={{ marginLeft: 0 }} className="profile-container" maxWidth="lg" >
                <Box flex="1">
                    <Paper className="profile-paper">
                        <div className="user-info">
                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" alt="User avatar" className="avatar" />
                            <div className="user-details">
                                <Typography variant="h6" className="username">{user.username}</Typography>
                            </div>
                        </div>
                    </Paper>
                    <Box className="profile-container" style={{ height: 180 }}>
                        <Paper className="button-paper">
                            <Button variant="outlined" color="primary" className="change-password-button" onClick={() => setPasswordDialogOpen(true)}>Change Password</Button>
                            <Button variant="contained" color="primary" className="change-username-button" style={{ marginTop: 10 }}>Change Username</Button>
                        </Paper>
                    </Box>
                </Box>
                <Box flex="1" ml={2}>
                    <Paper className="profile-info-paper" style={{ marginLeft: 0 , width: "300px"}}>
                        <Typography variant="h4" style={{textAlign: "center"}}>User Information</Typography>
                        <Typography variant="body1"><p><strong>Username:</strong> {user.username}</p></Typography>
                        <Typography variant="body1">
                            <p><strong>Password:</strong>  ********</p>
                        </Typography>
                        <Typography variant="body1"><p><strong>Role:</strong> {user.roles}</p></Typography>
                    </Paper>
                </Box>
            </Box>

            <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)}>
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter your new password and confirm it.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="New Password"
                        type="password"
                        fullWidth
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {passwordError && <Typography color="error">{passwordError}</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPasswordDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handlePasswordChange} color="primary">
                        Change
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Profile;