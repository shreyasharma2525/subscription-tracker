import { useEffect, useState } from "react";
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

function EditSubscriptionModal({
  isOpen,
  onClose,
  subscription,
  onUpdated,
  subscriptions,
}) {
  const [formData, setFormData] = useState({
    service_name: "",
    owner_name: "",
    cost: "",
    billing_cycle: "monthly",
    category: "entertainment",
    last_paid_date: "",
    next_renewal_date: "",
    is_active: true,
    notes: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (subscription) {
      setFormData({
        service_name: subscription.service_name || "",
        owner_name: subscription.owner_name || "",
        cost: subscription.cost || "",
        billing_cycle: subscription.billing_cycle || "monthly",
        category: subscription.category || "entertainment",
        last_paid_date: subscription.last_paid_date || "",
        next_renewal_date: subscription.next_renewal_date || "",
        is_active: subscription.is_active ?? true,
        notes: subscription.notes || "",
      });
    }
  }, [subscription]);

  if (!isOpen || !subscription) return null;

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const duplicate = subscriptions.some(
      (item) =>
        item.id !== subscription.id &&
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

      const response = await API.patch(
        `/subscriptions/${subscription.id}/`,
        formData
      );

      onUpdated(response.data);
      onClose();
    } catch (error) {
      console.error("Error updating subscription:", error);

      if (error.response?.status === 400) {
        alert(
          error.response?.data?.detail ||
            error.response?.data?.non_field_errors?.[0] ||
            "Invalid data. Please check all fields."
        );
        return;
      }

      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        window.location.href = "/login";
        return;
      }

      alert("Failed to update subscription.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box
      position="fixed"
      inset="0"
      bg="blackAlpha.600"
      zIndex="999"
      display="flex"
      justifyContent="flex-end"
    >
      <Box
        bg="white"
        w={{ base: "100%", md: "430px" }}
        minH="100vh"
        p={6}
        overflowY="auto"
        shadow="2xl"
      >
        <HStack justify="space-between" mb={6}>
          <Box>
            <Heading size="lg">Edit Subscription</Heading>
            <Text color="gray.500" fontSize="sm">
              Update subscription details.
            </Text>
          </Box>

          <Button variant="ghost" onClick={onClose}>
            <FiX />
          </Button>
        </HStack>

        <form onSubmit={handleSubmit}>
          <VStack align="stretch" gap={4}>
            <Box>
              <Text mb={1} fontSize="sm" fontWeight="medium">
                Service Name
              </Text>
              <Input
                name="service_name"
                value={formData.service_name}
                onChange={handleChange}
                required
              />
            </Box>

            <Box>
              <Text mb={1} fontSize="sm" fontWeight="medium">
                Owner Name
              </Text>
              <Input
                name="owner_name"
                value={formData.owner_name}
                onChange={handleChange}
                required
              />
            </Box>

            <Box>
              <Text mb={1} fontSize="sm" fontWeight="medium">
                Cost
              </Text>
              <Input
                name="cost"
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={handleChange}
                required
              />
            </Box>

            <Box>
              <Text mb={1} fontSize="sm" fontWeight="medium">
                Billing Cycle
              </Text>
              <select
                name="billing_cycle"
                value={formData.billing_cycle}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                }}
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="weekly">Weekly</option>
              </select>
            </Box>

            <Box>
              <Text mb={1} fontSize="sm" fontWeight="medium">
                Category
              </Text>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                }}
              >
                <option value="entertainment">Entertainment</option>
                <option value="productivity">Productivity</option>
                <option value="fitness">Fitness</option>
                <option value="utilities">Utilities</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
            </Box>

            <Box>
              <Text mb={1} fontSize="sm" fontWeight="medium">
                Last Paid Date
              </Text>
              <Input
                name="last_paid_date"
                type="date"
                value={formData.last_paid_date}
                onChange={handleChange}
                required
              />
            </Box>

            <Box>
              <Text mb={1} fontSize="sm" fontWeight="medium">
                Next Renewal Date
              </Text>
              <Input
                name="next_renewal_date"
                type="date"
                value={formData.next_renewal_date}
                onChange={handleChange}
                required
              />
            </Box>

            <Box>
              <Text mb={1} fontSize="sm" fontWeight="medium">
                Notes
              </Text>
              <Textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </Box>

            <HStack>
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
              />
              <Text fontSize="sm">Active subscription</Text>
            </HStack>

            <Button
              type="submit"
              colorPalette="purple"
              size="lg"
              loading={saving}
              loadingText="Updating..."
              mt={4}
            >
              Update Subscription
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
}

export default EditSubscriptionModal;