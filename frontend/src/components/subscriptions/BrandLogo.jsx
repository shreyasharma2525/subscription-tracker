import { Box, Text } from "@chakra-ui/react";

const getBrandStyle = (name = "") => {
  const lowerName = name.toLowerCase();

  if (lowerName.includes("netflix")) {
    return {
      bg: "black",
      color: "#E50914",
      label: "N",
    };
  }

  if (lowerName.includes("amazon") || lowerName.includes("prime")) {
    return {
      bg: "#0F79AF",
      color: "white",
      label: "P",
    };
  }

  if (lowerName.includes("spotify")) {
    return {
      bg: "#1DB954",
      color: "white",
      label: "S",
    };
  }

  if (lowerName.includes("hotstar") || lowerName.includes("jio")) {
    return {
      bg: "#111827",
      color: "#38BDF8",
      label: "J",
    };
  }

  if (lowerName.includes("tata")) {
    return {
      bg: "#1E40AF",
      color: "white",
      label: "T",
    };
  }

  return {
    bg: "purple.600",
    color: "white",
    label: name.charAt(0).toUpperCase() || "S",
  };
};

function BrandLogo({ name }) {
  const brand = getBrandStyle(name);

  return (
    <Box
      w="48px"
      h="48px"
      borderRadius="xl"
      bg={brand.bg}
      color={brand.color}
      display="flex"
      alignItems="center"
      justifyContent="center"
      shadow="md"
      flexShrink={0}
    >
      <Text fontSize="2xl" fontWeight="900">
        {brand.label}
      </Text>
    </Box>
  );
}

export default BrandLogo;