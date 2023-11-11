-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "studio" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "bpm" INTEGER NOT NULL,
    "start" INTEGER NOT NULL,
    "end" INTEGER NOT NULL,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Track" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "songId" TEXT NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MixSettings" (
    "id" TEXT NOT NULL,
    "songSlug" TEXT NOT NULL,
    "mixName" TEXT NOT NULL,
    "artistPhoto" TEXT NOT NULL DEFAULT 'default',
    "coverArt" TEXT NOT NULL DEFAULT '0',
    "private" BOOLEAN NOT NULL DEFAULT false,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "volume" DOUBLE PRECISION NOT NULL DEFAULT -32,
    "automationDataId" TEXT,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MixSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackSettings" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "songSlug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mixName" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "volume" INTEGER NOT NULL,
    "volumeMode" TEXT NOT NULL,
    "pan" INTEGER NOT NULL,
    "panMode" TEXT NOT NULL,
    "soloMute" JSONB NOT NULL,
    "soloMuteMode" TEXT NOT NULL,
    "fxNames" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "delaySettings" JSONB NOT NULL,
    "reverbSettings" JSONB NOT NULL,
    "pitchShiftSettings" JSONB NOT NULL,
    "panelPosition" JSONB NOT NULL,
    "panelSize" JSONB NOT NULL,
    "panelActive" BOOLEAN NOT NULL,
    "mixSettingsId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "TrackSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutomationData" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "mixSettingsId" TEXT NOT NULL,

    CONSTRAINT "AutomationData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "Song_slug_key" ON "Song"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "MixSettings_mixName_key" ON "MixSettings"("mixName");

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MixSettings" ADD CONSTRAINT "MixSettings_userName_fkey" FOREIGN KEY ("userName") REFERENCES "User"("userName") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackSettings" ADD CONSTRAINT "TrackSettings_mixSettingsId_fkey" FOREIGN KEY ("mixSettingsId") REFERENCES "MixSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackSettings" ADD CONSTRAINT "TrackSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutomationData" ADD CONSTRAINT "AutomationData_mixSettingsId_fkey" FOREIGN KEY ("mixSettingsId") REFERENCES "MixSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
