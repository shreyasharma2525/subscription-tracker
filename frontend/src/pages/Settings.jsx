import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Input,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Badge,
} from "@chakra-ui/react";
import {
  FiUser,
  FiLock,
  FiMonitor,
  FiDollarSign,
  FiLogOut,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAppSettings } from "../context/AppSettingsContext";

function Settings() {
  const navigate = useNavigate();
  const { user, updateProfile, changePassword, logout } = useAuth();

  const {
    themeMode,
    setThemeMode,
    currency,
    setCurrency,
    cardBg,
    inputBg,
    textColor,
    mutedText,
    borderColor,
  } = useAppSettings();

  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const selectStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: `1px solid ${borderColor}`,
    backgroundColor: inputBg,
    color: textColor,
  };

  const optionStyle = {
    backgroundColor: inputBg,
    color: textColor,
  };

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    try {
      setSavingProfile(true);
      await updateProfile(profileData);
      alert("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update failed:", error);
      alert(
        error.response?.data?.username?.[0] ||
          error.response?.data?.email?.[0] ||
          "Failed to update profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    try {
      setSavingPassword(true);
      await changePassword(passwordData);

      alert("Password changed successfully. Please login again.");

      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Password change failed:", error);
      alert(
        error.response?.data?.current_password?.[0] ||
          error.response?.data?.new_password?.[0] ||
          "Failed to change password."
      );
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <HStack justify="space-between" mb={8} wrap="wrap">
        <Box>
          <Heading size="xl" color={textColor}>
            Settings
          </Heading>

          <Text color={mutedText} mt={1}>
            Manage your profile, security, and app preferences.
          </Text>
        </Box>

        <Badge colorPalette="green" borderRadius="full" px={4} py={2}>
          Session Active
        </Badge>
      </HStack>

      <SimpleGrid columns={{ base: 1, xl: 2 }} gap={6}>
        <Box
          bg={cardBg}
          p={6}
          borderRadius="2xl"
          shadow="md"
          border="1px solid"
          borderColor={borderColor}
        >
          <HStack mb={5}>
            <Box
              w="42px"
              h="42px"
              borderRadius="xl"
              bg="purple.100"
              color="purple.700"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="22px"
            >
              <FiUser />
            </Box>

            <Box>
              <Heading size="md" color={textColor}>
                Profile Settings
              </Heading>
              <Text color={mutedText} fontSize="sm">
                Update your username and email.
              </Text>
            </Box>
          </HStack>

          <form onSubmit={handleProfileSubmit}>
            <VStack align="stretch" gap={4}>
              <Box>
                <Text mb={1} fontSize="sm" fontWeight="medium" color={textColor}>
                  Username
                </Text>
                <Input
                  name="username"
                  value={profileData.username}
                  onChange={handleProfileChange}
                  bg={inputBg}
                  color={textColor}
                  borderColor={borderColor}
                  required
                />
              </Box>

              <Box>
                <Text mb={1} fontSize="sm" fontWeight="medium" color={textColor}>
                  Email
                </Text>
                <Input
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  bg={inputBg}
                  color={textColor}
                  borderColor={borderColor}
                />
              </Box>

              <Button
                type="submit"
                colorPalette="purple"
                loading={savingProfile}
                loadingText="Saving..."
              >
                Save Profile
              </Button>
            </VStack>
          </form>
        </Box>

        <Box
          bg={cardBg}
          p={6}
          borderRadius="2xl"
          shadow="md"
          border="1px solid"
          borderColor={borderColor}
        >
          <HStack mb={5}>
            <Box
              w="42px"
              h="42px"
              borderRadius="xl"
              bg="red.100"
              color="red.700"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="22px"
            >
              <FiLock />
            </Box>

            <Box>
              <Heading size="md" color={textColor}>
                Security
              </Heading>
              <Text color={mutedText} fontSize="sm">
                Change your account password.
              </Text>
            </Box>
          </HStack>

          <form onSubmit={handlePasswordSubmit}>
            <VStack align="stretch" gap={4}>
              <Box>
                <Text mb={1} fontSize="sm" fontWeight="medium" color={textColor}>
                  Current Password
                </Text>
                <Input
                  name="current_password"
                  type="password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  bg={inputBg}
                  color={textColor}
                  borderColor={borderColor}
                  required
                />
              </Box>

              <Box>
                <Text mb={1} fontSize="sm" fontWeight="medium" color={textColor}>
                  New Password
                </Text>
                <Input
                  name="new_password"
                  type="password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  bg={inputBg}
                  color={textColor}
                  borderColor={borderColor}
                  required
                />
              </Box>

              <Button
                type="submit"
                colorPalette="red"
                variant="subtle"
                loading={savingPassword}
                loadingText="Updating..."
              >
                Change Password
              </Button>
            </VStack>
          </form>
        </Box>

        <Box
          bg={cardBg}
          p={6}
          borderRadius="2xl"
          shadow="md"
          border="1px solid"
          borderColor={borderColor}
        >
          <HStack mb={5}>
            <Box
              w="42px"
              h="42px"
              borderRadius="xl"
              bg="blue.100"
              color="blue.700"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="22px"
            >
              <FiMonitor />
            </Box>

            <Box>
              <Heading size="md" color={textColor}>
                Appearance
              </Heading>
              <Text color={mutedText} fontSize="sm">
                Choose how the app should look.
              </Text>
            </Box>
          </HStack>

          <VStack align="stretch" gap={4}>
            <Box>
              <Text mb={1} fontSize="sm" fontWeight="medium" color={textColor}>
                Theme Mode
              </Text>

              <select
                value={themeMode}
                onChange={(event) => setThemeMode(event.target.value)}
                style={selectStyle}
              >
                <option value="light" style={optionStyle}>
                  Light Theme
                </option>
                <option value="dark" style={optionStyle}>
                  Dark Theme
                </option>
              </select>
            </Box>

            <Text color={mutedText} fontSize="sm">
              Theme preference is saved in your browser.
            </Text>
          </VStack>
        </Box>

        <Box
          bg={cardBg}
          p={6}
          borderRadius="2xl"
          shadow="md"
          border="1px solid"
          borderColor={borderColor}
        >
          <HStack mb={5}>
            <Box
              w="42px"
              h="42px"
              borderRadius="xl"
              bg="green.100"
              color="green.700"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="22px"
            >
              <FiDollarSign />
            </Box>

            <Box>
              <Heading size="md" color={textColor}>
                Preferences
              </Heading>
              <Text color={mutedText} fontSize="sm">
                Set your default app preferences.
              </Text>
            </Box>
          </HStack>

          <VStack align="stretch" gap={4}>
            <Box>
              <Text mb={1} fontSize="sm" fontWeight="medium" color={textColor}>
                Currency
              </Text>

              <select
                value={currency}
                onChange={(event) => setCurrency(event.target.value)}
                style={selectStyle}
              >
                <option value="INR" style={optionStyle}>
                  INR - ₹
                </option>
                <option value="USD" style={optionStyle}>
                  USD - $
                </option>
                <option value="EUR" style={optionStyle}>
                  EUR - €
                </option>
                <option value="GBP" style={optionStyle}>
                  GBP - £
                </option>
              </select>
            </Box>

            <Text color={mutedText} fontSize="sm">
              Currency changes the symbol shown across the dashboard.
            </Text>
          </VStack>
        </Box>
      </SimpleGrid>

      <Box
        mt={6}
        bg={cardBg}
        p={6}
        borderRadius="2xl"
        shadow="md"
        border="1px solid"
        borderColor={borderColor}
      >
        <HStack justify="space-between" wrap="wrap">
          <Box>
            <Heading size="md" color={textColor}>
              Account Session
            </Heading>
            <Text color={mutedText} mt={1}>
              Logged in as {user?.username} {user?.email ? `(${user.email})` : ""}
            </Text>
          </Box>

          <Button colorPalette="red" variant="subtle" onClick={handleLogout}>
            <FiLogOut />
            Logout
          </Button>
        </HStack>
      </Box>
    </>
  );
}

export default Settings;