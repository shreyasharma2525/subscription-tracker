import { useState } from "react";
import {
  Box,
  Button,
  Heading,
  Input,
  Text,
  VStack,
  HStack,
  Textarea,
} from "@chakra-ui/react";
import { FiX } from "react-icons/fi";
import API from "../../api/subscriptionApi";
import { useAppSettings } from "../../context/AppSettingsContext";
import { useAuth } from "../../context/AuthContext";

function AddSubscriptionModal({ isOpen, onClose, onCreated, subscriptions }) {
  const {
    cardBg,
    inputBg,
    textColor,
    mutedText,
    borderColor,
  } = useAppSettings();

  const { user } = useAuth();

  const defaultOwnerName =
    `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
    user?.username ||
    "";

  const [formData, setFormData] = useState({
    service_name: "",
    owner_name: defaultOwnerName,
    cost: "",
    billing_cycle: "monthly",
    category: "entertainment",
    last_paid_date: "",
    next_renewal_date: "",
    is_active: true,
    notes: "",
  });

  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

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

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      service_name: "",
      owner_name: defaultOwnerName,
      cost: "",
      billing_cycle: "monthly",
      category: "entertainment",
      last_paid_date: "",
      next_renewal_date: "",
      is_active: true,
      notes: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cleanedCost = Number(formData.cost);

    if (!cleanedCost || cleanedCost <= 0) {
      alert("Please enter a valid cost greater than 0.");
      return;
    }

    const duplicate = subscriptions.some(
      (item) =>
        item.service_name.toLowerCase().trim() ===
          formData.service_name.toLowerCase().trim() &&
        item.owner_name.toLowerCase().trim() ===
          formData.owner_name.toLowerCase().trim()
    );

    if (duplicate) {
      alert("This subscription already exists for this owner.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...formData,
        cost: cleanedCost,
      };

      const response = await API.post("/subscriptions/", payload);

      onCreated(response.data);
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error adding subscription:", error);

      const data = error.response?.data;

      alert(
        data?.non_field_errors?.[0] ||
          data?.service_name?.[0] ||
          data?.owner_name?.[0] ||
          data?.cost?.[0] ||
          data?.last_paid_date?.[0] ||
          data?.next_renewal_date?.[0] ||
          data?.detail ||
          JSON.stringify(data) ||
          "Failed to add subscription."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box
      position="fixed"
      inset="0"
      bg="blackAlpha.700"
      zIndex="999"
      display="flex"
      justifyContent="flex-end"
    >
      <Box
        bg={cardBg}
        color={textColor}
        w={{ base: "100%", md: "430px" }}
        minH="100vh"
        p={6}
        overflowY="auto"
        shadow="2xl"
        borderLeft="1px solid"
        borderColor={borderColor}
      >
        <HStack justify="space-between" mb={6}>
          <Box>
            <Heading size="lg" color={textColor}>
              Add Subscription
            </Heading>
            <Text color={mutedText} fontSize="sm">
              Add a new recurring payment.
            </Text>
          </Box>

          <Button variant="ghost" onClick={onClose} color={textColor}>
            <FiX />
          </Button>
        </HStack>

        <form onSubmit={handleSubmit}>
          <VStack align="stretch" gap={4}>
            <Box>
              <Text mb={1} fontSize="sm" fontWeight="medium" color={textColor}>
                Service Name
              </Text>
              <Input
                name="service_name"
                placeholder="Netflix"
                value={formData.service_name}
                onChange={handleChange}
                bg={inputBg}
                color={textColor}
                borderColor={borderColor}
                _placeholder={{ color: mutedText }}
                required
              />
            </Box>

            <Box>
              <Text mb={1} fontSize="sm" fontWeight="medium" color={textColor}>
                Owner Name
              </Text>
              <Input
                name="owner_name"
                placeholder="Owner name"
                value={formData.owner_name}
                onChange={handleChange}
                bg={inputBg}
                color={textColor}
                borderColor={borderColor}
                _placeholder={{ color: mutedText }}
                required
              />
            </Box>

            <Box>
              <Text mb={1} fontSize="sm" fontWeight="medium" color={textColor}>
                Cost
              </Text>
              <Input
                name="cost"
                type="number"
                inputMode="decimal"
                min="1"
                step="0.01"
                placeholder="699"
                value={formData.cost}
                onChange={handleChange}
                bg={inputBg}
                color={textColor}
                borderColor={borderColor}
                _placeholder={{ color: mutedText }}
                required
              />
            </Box>

            <Box>
              <Text mb={1} fontSize="sm" fontWeight="medium" color={textColor}>
                Billing Cycle
              </Text>
              <select
                name="billing_cycle"
                value={formData.billing_cycle}
                onChange={handleChange}
                style={selectStyle}
              >
                <option value="monthly" style={optionStyle}>
                  Monthly
                </option>
                <option value="yearly" style={optionStyle}>
                  Yearly
                </option>
                <option value="weekly" style={optionStyle}>
                  Weekly
                </option>
              </select>
            </Box>

            <Box>
              <Text mb={1} fontSize="sm" fontWeight="medium" color={textColor}>
                Category
              </Text>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={selectStyle}
              >
                <option value="entertainment" style={optionStyle}>
                  Entertainment
                </option>
                <option value="productivity" style={optionStyle}>
                  Productivity
                </option>
                <option value="fitness" style={optionStyle}>
                  Fitness
                </option>
                <option value="utilities" style={optionStyle}>
                  Utilities
                </option>
                <option value="education" style={optionStyle}>
                  Education
                </option>
                <option value="other" style={optionStyle}>
                  Other
                </option>
              </select>
            </Box>

            <Box>
              <Text mb={1} fontSize="sm" fontWeight="medium" color={textColor}>
                Last Paid Date
              </Text>
              <Input
                name="last_paid_date"
                type="date"
                value={formData.last_paid_date}
                onChange={handleChange}
                bg={inputBg}
                color={textColor}
                borderColor={borderColor}
                required
              />
            </Box>

            <Box>
              <Text mb={1} fontSize="sm" fontWeight="medium" color={textColor}>
                Next Renewal Date
              </Text>
              <Input
                name="next_renewal_date"
                type="date"
                value={formData.next_renewal_date}
                onChange={handleChange}
                bg={inputBg}
                color={textColor}
                borderColor={borderColor}
                required
              />
            </Box>

            <Box>
              <Text mb={1} fontSize="sm" fontWeight="medium" color={textColor}>
                Notes
              </Text>
              <Textarea
                name="notes"
                placeholder="Any extra details..."
                value={formData.notes}
                onChange={handleChange}
                bg={inputBg}
                color={textColor}
                borderColor={borderColor}
                _placeholder={{ color: mutedText }}
              />
            </Box>

            <HStack>
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
              />
              <Text fontSize="sm" color={mutedText}>
                Active subscription
              </Text>
            </HStack>

            <Button
              type="submit"
              colorPalette="purple"
              size="lg"
              loading={saving}
              loadingText="Adding..."
              mt={4}
            >
              Add Subscription
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
}

export default AddSubscriptionModal;