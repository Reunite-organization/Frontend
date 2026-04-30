import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Shirt, MapPin, Calendar, FileText } from "lucide-react";

export default function ExtractedDataDisplay({ extractedData }) {
  if (!extractedData) return null;

  const {
    name,
    age,
    gender,
    clothing = [],
    description,
    lastSeenLocation,
    distinguishingFeatures = [],
    possibleDestinations = [],
    urgencyIndicators = [],
  } = extractedData;

  return (
    <Card className="bg-green-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <FileText className="w-5 h-5" />
          AI Extracted Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Personal Information */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-800">
                Personal Details
              </span>
            </div>
            <div className="pl-6 space-y-1 text-sm">
              {name && (
                <p>
                  <strong>Name:</strong> {name}
                </p>
              )}
              {age && (
                <p>
                  <strong>Age:</strong> {age} years old
                </p>
              )}
              {gender && gender !== "unknown" && (
                <p>
                  <strong>Gender:</strong> {gender}
                </p>
              )}
            </div>
          </div>

          {/* Clothing */}
          {clothing && clothing.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shirt className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-800">Clothing</span>
              </div>
              <div className="pl-6">
                <div className="flex flex-wrap gap-1">
                  {clothing.map((item, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Location */}
        {lastSeenLocation && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-800">
                Last Seen Location
              </span>
            </div>
            <p className="pl-6 text-sm">{lastSeenLocation}</p>
          </div>
        )}

        {/* Distinguishing Features */}
        {distinguishingFeatures && distinguishingFeatures.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-800">
                Distinguishing Features
              </span>
            </div>
            <div className="pl-6">
              <div className="flex flex-wrap gap-1">
                {distinguishingFeatures.map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Possible Destinations */}
        {possibleDestinations && possibleDestinations.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-800">
                Possible Destinations
              </span>
            </div>
            <div className="pl-6">
              <div className="flex flex-wrap gap-1">
                {possibleDestinations.map((dest, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {dest}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Urgency Indicators */}
        {urgencyIndicators && urgencyIndicators.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-800">
                Urgency Indicators
              </span>
            </div>
            <div className="pl-6">
              <div className="flex flex-wrap gap-1">
                {urgencyIndicators.map((indicator, index) => (
                  <Badge key={index} variant="destructive" className="text-xs">
                    {indicator}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        {description && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-800">Description</span>
            </div>
            <p className="pl-6 text-sm text-gray-700">{description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
