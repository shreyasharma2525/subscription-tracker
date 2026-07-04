import { Flex, Box, Heading, Text, Input, HStack } from "@chakra-ui/react";
import { useAuth } from "../../context/AuthContext";
import { useAppSettings } from "../../context/AppSettingsContext";

function Header({ searchTerm, onSearchChange }) {
  const { user } = useAuth();
  const { textColor, mutedText, cardBg, borderColor } = useAppSettings();

  const fullName =
    `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
    user?.username ||
    "User";

  return (
    <Flex justify="space-between" align="center" mb={8} gap={6} wrap="wrap">
      <Box>
        <Heading size="xl" color={textColor}>
          Dashboard
        </Heading>

        <Text color={mutedText} mt={1}>
          Welcome back, {fullName} 👋
        </Text>
      </Box>

      <HStack>
        <Input
          w={{ base: "100%", md: "360px" }}
          bg={cardBg}
          color={textColor}
          borderColor={borderColor}
          placeholder="Search subscriptions..."
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </HStack>
    </Flex>
  );
}

export default Header;