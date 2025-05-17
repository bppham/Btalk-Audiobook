package com.project.audiobook.utils;

import java.text.Normalizer;
import java.util.regex.Pattern;

public class HandleFile {
    public static String normalizeTitle(String title) {
        String temp = Normalizer.normalize(title, Normalizer.Form.NFD);
        return Pattern.compile("[^\\w\\s-]").matcher(temp).replaceAll("").replaceAll("\\s+", "_");
    }
}
