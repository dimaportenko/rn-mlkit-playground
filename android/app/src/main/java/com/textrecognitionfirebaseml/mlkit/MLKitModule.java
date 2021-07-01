package com.textrecognitionfirebaseml.mlkit;

import android.graphics.Point;
import android.graphics.Rect;
import android.net.Uri;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.text.Text;
import com.google.mlkit.vision.text.TextRecognition;
import com.google.mlkit.vision.text.TextRecognizer;
import com.google.mlkit.vision.text.TextRecognizerOptions;

import java.io.IOException;


public class MLKitModule extends ReactContextBaseJavaModule {

    MLKitModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "MLKitModule";
    }

    public WritableMap getMapFromRect(Rect rect) {
        WritableMap blockRect = Arguments.createMap();

        blockRect.putDouble("bottom", rect.bottom);
        blockRect.putDouble("top", rect.top);
        blockRect.putDouble("left", rect.left);
        blockRect.putDouble("right", rect.right);

        return blockRect;
    }

    @ReactMethod
    public void recognizeText(String url, final Promise promise) {
        Uri uri = Uri.parse(url);

        InputImage image;
        try {
            image = InputImage.fromFilePath(getReactApplicationContext(), uri);

            TextRecognizer recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS);

            Task<Text> result =
                recognizer.process(image)
                    .addOnSuccessListener(new OnSuccessListener<Text>() {
                        @Override
                        public void onSuccess(Text result) {
                            // Task completed successfully
                            // ...
                            Log.d("TEST", result.getText());

                            String resultText = result.getText();
                            WritableMap response = Arguments.createMap();
                            WritableArray blocks = Arguments.createArray();
                            for (Text.TextBlock block : result.getTextBlocks()) {
                                WritableArray lines = Arguments.createArray();
                                WritableMap blockItem = Arguments.createMap();

                                String blockText = block.getText();
                                blockItem.putString("text", blockText);

                                Rect blockFrame = block.getBoundingBox();
                                WritableMap blockRect = getMapFromRect(blockFrame);
                                blockItem.putMap("rect", blockRect);

                                for (Text.Line line : block.getLines()) {
                                    WritableMap lineItem = Arguments.createMap();

                                    String lineText = line.getText();
                                    lineItem.putString("text", lineText);

                                    Rect lineFrame = line.getBoundingBox();
                                    WritableMap lineRect = getMapFromRect(lineFrame);
                                    lineItem.putMap("rect", lineRect);

                                    lines.pushMap(lineItem);
                                }
                                blockItem.putArray("lines", lines);
                                blocks.pushMap(blockItem);
                            }
                            response.putArray("blocks", blocks);
                            promise.resolve(response);
                        }
                    })
                    .addOnFailureListener(
                        new OnFailureListener() {
                            @Override
                            public void onFailure(@NonNull Exception e) {
                                // Task failed with an exception
                                // ...
                                promise.reject("text recognition is failed", e);
                            }
                        });

        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}
