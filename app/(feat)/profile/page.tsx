"use client";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Post() {
  const [profile, setProfile] = useState<any>();
  const handleGetProfile = useCallback(() => {
    const profileString = sessionStorage.getItem("profile");
    const profileData = profileString ? JSON.parse(profileString) : null;
    setProfile(profileData);
    console.log(profileData);
  }, []);
  useEffect(() => {
    handleGetProfile();
  }, []);
  return (
    <div>
      <h1 className="head-text text-left">Profile</h1>
      {profile ? (
        <div style={{ color: "white", margin: "2rem" }}>
          <div
            style={{
              display: "flex",
              alignContent: "center",
              justifyContent: "space-between",
            }}
          >
            <h4
              style={{
                paddingTop: "5rem",
                display: "inline",
                fontWeight: "bold",
                fontSize: "24px",
              }}
            >
              Owner: {profile.name}
            </h4>
            <h5
              style={{
                paddingTop: "5.5rem",
                display: "inline-block",

                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              {profile.handle}
            </h5>
            <img src={profile.imageURI} alt="Profile Image" />
          </div>
          <br />
          <br />
          <br />
          <br />
          <br />
          <p
            style={{
              display: "inline-block",
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            Bio:
            <br />
          </p>
          <p>{profile.bio}</p>

          <Button style={{ margin: "5rem 0" }}>
            <Link href="/updateprofile">Update Profile</Link>
          </Button>
        </div>
      ) : (
        <h5>LOADING....</h5>
      )}
    </div>
  );
}
